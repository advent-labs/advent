use anchor_lang::prelude::*;
use anchor_spl::token::{self, *};

use crate::state::*;

#[derive(Accounts)]
pub struct VariableDepositCollateral<'info> {
    pub authority: Signer<'info>,

    pub market: AccountLoader<'info, Market>,

    pub reserve: Account<'info, Reserve>,

    #[account(mut)]
    pub positions: AccountLoader<'info, Positions>,

    /// Vault holding deposit notes as collateral
    #[account(mut)]
    pub deposit_note_vault: Account<'info, TokenAccount>,

    /// User's token account for deposit notes
    #[account(mut)]
    pub deposit_note_user: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<VariableDepositCollateral>, amount: u64) -> Result<()> {
    let mut positions = ctx.accounts.positions.load_mut()?;
    let reserve = &ctx.accounts.reserve;

    positions.add_variable_deposit_collateral(reserve.token, amount)?;

    token::transfer(ctx.accounts.transfer_context(), amount)?;

    Ok(())
}

impl<'info> VariableDepositCollateral<'info> {
    fn transfer_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.deposit_note_user.to_account_info(),
                to: self.deposit_note_vault.to_account_info(),
                authority: self.authority.to_account_info(),
            },
        )
    }
}
