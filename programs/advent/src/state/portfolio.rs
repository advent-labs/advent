use anchor_lang::prelude::*;

use crate::errors::ErrorCode;

#[zero_copy]
#[derive(Default)]
pub struct FixedDeposit {
    /// Mint
    pub token: Pubkey,
    /// Start epoch (day)
    pub start: u64,
    /// Duration in epochs (days)
    pub duration: u64,
    /// Amount borrowed
    pub amount: u64,
    /// Amount of interest
    pub interest_amount: u64,

    /// Holds deposit notes
    /// Purely for accounting purposes, as these are unusable by the user
    /// Whet the fixed deposit is claimed, these notes will be burned
    pub deposit_note_vault: Pubkey,
}

#[zero_copy]
#[derive(Default)]
pub struct FixedBorrow {
    /// Mint
    pub token: Pubkey,
    /// Start epoch (day)
    pub start: u64,
    /// Duration in epochs (days)
    pub duration: u64,
    /// Amount borrowed
    pub amount: u64,
    /// Amount of interest
    pub interest_amount: u64,
}

#[zero_copy]
#[derive(Default)]
pub struct VariableDeposit {
    pub token: Pubkey,
    pub collateral_vault_account: Pubkey,
    pub collateral_amount: u64,
    pub collateral_coefficient: u64,
}

#[zero_copy]
#[derive(Default)]
pub struct VariableBorrow {
    pub token: Pubkey,
    pub amount: u64,
}

#[account(zero_copy)]
#[repr(packed)]
pub struct Positions {
    pub variable_deposits: [VariableDeposit; 16],
    pub variable_borrows: [VariableBorrow; 16],
    pub fixed_deposits: [FixedDeposit; 32],
    pub fixed_borrows: [FixedBorrow; 32],
}

#[account]
#[derive(Default)]
pub struct Portfolio {
    pub main: Pubkey,
    pub positions: Pubkey,
    pub authority: Pubkey,
    pub bump: u8,
}

impl Default for Positions {
    #[inline]
    fn default() -> Positions {
        Positions {
            fixed_borrows: [FixedBorrow {
                ..Default::default()
            }; 32],
            fixed_deposits: [FixedDeposit {
                ..Default::default()
            }; 32],
            variable_deposits: [VariableDeposit {
                ..Default::default()
            }; 16],
            variable_borrows: [VariableBorrow {
                ..Default::default()
            }; 16],
        }
    }
}

impl Positions {
    pub fn register_variable_deposit(&mut self, new: VariableDeposit) -> Result<()> {
        for d in self.variable_deposits.iter_mut() {
            if d.token == new.token {
                panic!(
                    "Cannot register {:?} for portfolio as it is \
                        already registered with {:?} for this obligation",
                    new.token, d.token
                );
            }

            if d.token != Pubkey::default() {
                continue;
            }

            *d = new;

            return Ok(());
        }

        Err(error!(ErrorCode::NoFreeVariableDeposits))
    }

    pub fn add_fixed_borrow(&mut self, new: FixedBorrow) -> Result<()> {
        for x in self.fixed_borrows.iter_mut() {
            if x.token != Pubkey::default() {
                continue;
            }
            *x = new;

            return Ok(());
        }

        Err(error!(ErrorCode::NoFreeFixedBorrow))
    }

    pub fn add_variable_deposit_collateral(
        &mut self,
        token: Pubkey,
        notes_amount: u64,
    ) -> Result<()> {
        let d = self.get_variable_deposit_mut(token)?;
        d.add_collateral(notes_amount);
        Ok(())
    }

    pub fn withdraw_variable_deposit_collateral(
        &mut self,
        token: Pubkey,
        notes_amount: u64,
    ) -> Result<()> {
        let d = self.get_variable_deposit_mut(token)?;
        d.subtract_collateral(notes_amount);
        Ok(())
    }

    pub fn get_variable_deposit_mut(&mut self, token: Pubkey) -> Result<&mut VariableDeposit> {
        let deposit = self
            .variable_deposits
            .iter_mut()
            .find(|d| d.token == token)
            .ok_or(error!(ErrorCode::UnregisteredVariableDeposit))?;
        Ok(deposit)
    }
}

impl VariableDeposit {
    pub fn add_collateral(&mut self, notes_amount: u64) {
        self.collateral_amount = self.collateral_amount.checked_add(notes_amount).unwrap();
    }

    pub fn subtract_collateral(&mut self, notes_amount: u64) {
        self.collateral_amount = self.collateral_amount.checked_sub(notes_amount).unwrap();
    }
}
