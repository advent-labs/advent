use anchor_lang::prelude::*;

use crate::number::Number;

use super::FixedBorrow;

#[account(zero_copy)]
#[repr(packed)]
#[derive(Default)]
pub struct Reserve {
    pub market: Pubkey,
    pub token: Pubkey,
    pub decimals: i16,
    pub cached_price_quote: u64,

    /// Total amount of debt
    pub total_debt: u64,

    /// Amount of debt owed by fixed loans
    pub fixed_debt: u64,

    /// Total deposited tokens in the reserve
    pub total_deposits: u64,

    /// Independently track fixed deposits, as they are not used to compute note-to-token exchange rate
    pub fixed_deposits: u64,

    pub loan_notes: u64,
    pub deposit_notes: u64,

    pub vault: Pubkey,
    pub pyth_oracle_price: Pubkey,
    pub deposit_note_mint: Pubkey,
    pub settlement_table: Pubkey,
    pub policy: ReservePolicy,
    pub bump: u8,
}

#[account(zero_copy)]
#[repr(packed)]
pub struct SettlementTable {
    pub market: Pubkey,
    pub reserve: Pubkey,
    pub periods: [SettlementPeriod; 365],
}

#[zero_copy]
#[derive(Default, AnchorDeserialize, AnchorSerialize)]
pub struct ReservePolicy {
    pub target_utilization: u64,
    pub borrow_rate_0: u64,
    pub borrow_rate_1: u64,
}

#[zero_copy]
#[derive(Default)]
pub struct SettlementPeriod {
    pub deposited: u64,
    pub borrowed: u64,
    pub free_interest: Number,
}

impl Reserve {
    pub fn variable_deposit(&mut self, token_amount: u64, note_amount: u64) {
        self.total_deposits += token_amount;
        // TODO - compute notes
        self.deposit_notes += note_amount;
    }

    pub fn variable_withdraw(&mut self, token_amount: u64, note_amount: u64) {
        self.total_deposits -= token_amount;
        self.deposit_notes -= note_amount;
    }

    pub fn interest_rate(&self) -> Number {
        Number::from_decimal(6, -2)
    }

    /// TODO - calculate notes
    pub fn fixed_borrow(&mut self, st: &mut SettlementTable, duration: usize, amount: u64) {
        let interest_rate = self.interest_rate();
        st.apply_fixed_borrow(duration, amount, self.decimals, interest_rate);
        self.fixed_debt += amount;
        self.total_debt += amount;
        self.total_deposits -= amount;
    }

    pub fn make_fixed_borrow(&self, start: u32, duration: u32, amount: u64) -> FixedBorrow {
        let interest = Number::ONE;
        let token = self.token;
        FixedBorrow {
            token,
            start,
            duration,
            amount,
            interest,
        }
    }
}

impl Default for SettlementTable {
    #[inline]
    fn default() -> SettlementTable {
        SettlementTable {
            market: Pubkey::default(),
            reserve: Pubkey::default(),
            periods: [SettlementPeriod {
                deposited: 0,
                borrowed: 0,
                free_interest: Number::ZERO,
            }; 365],
        }
    }
}

impl SettlementTable {
    pub fn apply_fixed_borrow(
        &mut self,
        duration: usize,
        amount: u64,
        decimals: i16,
        interest_rate: Number,
    ) {
        let interest_paid = interest_rate * Number::from_decimal(amount, decimals) / 365;
        for n in 0..duration {
            self.periods[n].free_interest += interest_paid;
            self.periods[n].borrowed += amount;
        }
    }

    /// Apply a fixed deposit to the settlment table, returning the total interest paid
    pub fn apply_fixed_deposit(&mut self, duration: usize, amount: u64, decimals: i16) -> Number {
        let mut total = Number::ZERO;

        self.periods[0..duration]
            .iter_mut()
            .for_each(|p| total += p.apply_fixed_deposit(amount, decimals));

        total
    }
}

impl SettlementPeriod {
    pub fn allocated_interest_rate_for_period(&self) -> Number {
        let _ratio = Number::from(self.deposited) / Number::from(self.borrowed);
        // TODO - sqrt(1 - 1(1 + ratio ** 2))

        // Just return 5% for now
        Number::from_decimal(5, -2)
    }

    pub fn apply_fixed_deposit(&mut self, amount: u64, decimals: i16) -> Number {
        self.deposited += amount;
        let interest_earned = self.allocated_interest_amount_for_period();
        self.free_interest -= interest_earned;

        interest_earned
    }

    pub fn apply_fixed_borrow(&mut self, amount: u64, interest_paid: Number) {}

    /// How much interest will be collected, in absolute token units
    pub fn allocated_interest_amount_for_period(&self) -> Number {
        // TODO
        self.free_interest / 2
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn number() {
        let n1 = Number::from_decimal(1_000, -3);
        let n2 = Number::from_decimal(1_000_000, -6);

        assert_eq!(n1, Number::ONE);
        assert_eq!(n2, Number::ONE);
        assert_eq!(n1 / n2, Number::ONE);

        let n1 = Number::from_decimal(500, -3);
        let n2 = Number::from_decimal(1_000_000, -6);

        assert_eq!(n1 * n2, Number::from_decimal(5, -1));
    }

    #[test]
    fn apply_fixed_borrow_zero() {
        let mut st = SettlementTable::default();

        st.apply_fixed_borrow(0, 0, 0, Number::ZERO);

        assert_eq!(st.periods[0].borrowed, 0);

        st.apply_fixed_borrow(365, 0, 0, Number::ZERO);
        assert_eq!(st.periods[0].borrowed, 0);
        assert_eq!(st.periods[1].borrowed, 0);
    }

    #[test]
    fn apply_fixed_borrow() {
        let mut st = SettlementTable::default();

        st.apply_fixed_borrow(8, 1_000_000, -6, Number::from_decimal(365u64, 0));

        assert_eq!(st.periods[0].borrowed, 1_000_000);
        assert_eq!(st.periods[7].borrowed, 1_000_000);

        assert_eq!(st.periods[0].free_interest, Number::ONE);

        st.apply_fixed_borrow(8, 1_000_000, -6, Number::from_decimal(1825u64, -1));

        assert_eq!(st.periods[0].borrowed, 2_000_000);
        assert_eq!(st.periods[7].borrowed, 2_000_000);

        assert_eq!(st.periods[0].free_interest, Number::from_decimal(15, -1));
    }
}
