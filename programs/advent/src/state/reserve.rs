use anchor_lang::prelude::*;
use jet_math::Number;

#[account(zero_copy)]
#[repr(packed)]
#[derive(Default)]
pub struct Reserve {
    pub market: Pubkey,
    pub token: Pubkey,
    pub decimals: u8,
    pub cached_price_quote: u64,
    pub total_debt: u64,
    pub total_deposits: u64,
    pub total_loan_notes: u64,
    pub total_deposit_notes: u64,
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
    pub borrowed: Number,
    pub free_interest: Number,
}

impl Reserve {
    pub fn deposit(&mut self, amount: u64) {
        self.total_deposits += amount;
    }

    pub fn fixed_borrow(
        &mut self,
        st: &mut SettlementTable,
        duration: usize,
        amount: Number,
        interest_rate: Number,
    ) {
        st.apply_fixed_borrow(duration, amount, interest_rate);
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
                borrowed: Number::ZERO,
                free_interest: Number::ZERO,
            }; 365],
        }
    }
}

impl SettlementTable {
    pub fn apply_fixed_borrow(&mut self, duration: usize, amount: Number, interest_rate: Number) {
        let interest_paid = amount * interest_rate / 365;
        for n in 0..duration {
            self.periods[n].free_interest += interest_paid;
            self.periods[n].borrowed += amount;
        }
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

        st.apply_fixed_borrow(0, Number::ZERO, Number::ZERO);

        assert_eq!(st.periods[0].borrowed, Number::ZERO);

        st.apply_fixed_borrow(365, Number::ZERO, Number::ZERO);
        assert_eq!(st.periods[0].borrowed, Number::ZERO);
        assert_eq!(st.periods[1].borrowed, Number::ZERO);
    }

    #[test]
    fn apply_fixed_borrow() {
        let mut st = SettlementTable::default();

        st.apply_fixed_borrow(
            8,
            Number::from_decimal(1_000_000, -6),
            Number::from_decimal(365, 0),
        );

        assert_eq!(st.periods[0].borrowed, 1u64.into());
        assert_eq!(st.periods[7].borrowed, 1u64.into());

        assert_eq!(st.periods[0].free_interest, 1u64.into());

        st.apply_fixed_borrow(
            8,
            Number::from_decimal(1_000_000, -6),
            Number::from_decimal(1825, -1),
        );

        assert_eq!(st.periods[0].borrowed, 2u64.into());
        assert_eq!(st.periods[7].borrowed, 2u64.into());

        assert_eq!(st.periods[0].free_interest, Number::from_decimal(15, -1));
    }
}
