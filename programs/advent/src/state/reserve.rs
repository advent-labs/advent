use anchor_lang::prelude::*;

#[account(zero_copy)]
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
    pub periods: [SettlementPeriod; 365],
    pub policy: ReservePolicy,
    pub bump: u8,
}

#[zero_copy]
#[derive(Default)]
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
    pub free_interest: u64,
}

impl Reserve {
    pub fn deposit(&mut self, amount: u64) {
        self.total_deposits += amount;
    }
}

impl Default for Reserve {
    #[inline]
    fn default() -> Reserve {
        Reserve {
            market: Pubkey::default(),
            token: Pubkey::default(),
            pyth_oracle_price: Pubkey::default(),
            vault: Pubkey::default(),
            cached_price_quote: 0,
            decimals: 0,
            total_debt: 0,
            total_deposits: 0,
            total_loan_notes: 0,
            total_deposit_notes: 0,
            deposit_note_mint: Pubkey::default(),
            periods: [SettlementPeriod {
                deposited: 0,
                borrowed: 0,
                free_interest: 0,
            }; 365],
            policy: ReservePolicy {
                ..Default::default()
            },
            bump: 0,
        }
    }
}
