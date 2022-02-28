use anchor_lang::prelude::*;

use crate::errors::ErrorCode;

#[zero_copy]
#[derive(Default, Debug)]
pub struct FixedDeposit {
    pub token: Pubkey,
    pub start: u64,
    pub duration: u32,
    pub amount: u64,
    pub interest: u64,
}

#[zero_copy]
#[derive(Default, Debug)]
pub struct FixedBorrow {
    pub token: Pubkey,
    pub start: u64,
    pub duration: u32,
    pub amount: u64,
    pub interest: u64,
}

#[zero_copy]
#[derive(Default, Debug)]
pub struct VariableDeposit {
    pub token: Pubkey,
    pub amount: u64,
    pub deposit_notes: u64,
    pub collateral_coefficient: u64,
    pub collateral_vault_account: Pubkey,
}

#[account(zero_copy)]
pub struct Portfolio {
    pub main: Pubkey,
    pub authority: Pubkey,
    pub fixed_deposits: [FixedDeposit; 32],
    pub fixed_borrows: [FixedBorrow; 32],
    pub variable_deposits: [VariableDeposit; 16],
    pub bump: u8,
}

impl Default for Portfolio {
    #[inline]
    fn default() -> Portfolio {
        Portfolio {
            main: Pubkey::default(),
            authority: Pubkey::default(),
            fixed_borrows: [FixedBorrow {
                ..Default::default()
            }; 32],
            fixed_deposits: [FixedDeposit {
                ..Default::default()
            }; 32],
            variable_deposits: [VariableDeposit {
                ..Default::default()
            }; 16],
            bump: 0,
        }
    }
}

impl Portfolio {
    fn register_variable_deposit(&mut self, new: VariableDeposit) -> Result<(), ErrorCode> {
        for d in self.variable_deposits.iter_mut() {
            if d.token == new.token {
                panic!(
                    "Cannot register {:?} for portfolio as it is \
                        already registered with {:?} for this obligation",
                    new.token, d
                );
            }

            if d.token != Pubkey::default() {
                continue;
            }

            *d = new;

            return Ok(());
        }

        Err(ErrorCode::NoFreeVariableDeposits)
    }

    fn add_fixed_borrow(&mut self, new: FixedBorrow) -> Result<(), ErrorCode> {
        for x in self.fixed_borrows.iter_mut() {
            if x.token != Pubkey::default() {
                continue;
            }

            *x = new;

            return Ok(());
        }

        Err(ErrorCode::NoFreeVariableDeposits)
    }

    fn add_variable_deposit(
        &mut self,
        token: Pubkey,
        amount: u64,
        notes_amount: u64,
    ) -> Result<(), ErrorCode> {
        let d = self.get_variable_deposit_mut(token)?;
        d.add(amount, notes_amount);
        Ok(())
    }

    fn get_variable_deposit_mut(
        &mut self,
        token: Pubkey,
    ) -> Result<&mut VariableDeposit, ErrorCode> {
        let deposit = self
            .variable_deposits
            .iter_mut()
            .find(|d| d.token == token)
            .ok_or(ErrorCode::UnregisteredVariableDeposit)?;
        Ok(deposit)
    }
}

impl VariableDeposit {
    fn add(&mut self, amount: u64, notes_amount: u64) {
        self.amount.checked_add(amount).unwrap();
        self.deposit_notes.checked_add(notes_amount).unwrap();
    }
}
