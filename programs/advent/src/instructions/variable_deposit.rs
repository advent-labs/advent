use anchor_lang::prelude::*;
use anchor_spl::token::*;

use crate::state::*;

#[derive(Accounts)]
pub struct VariableDeposit<'info> {
    pub authority: Signer<'info>,

    #[account(mut)]
    pub portfolio: AccountLoader<'info, Portfolio>,

    #[account(mut)]
    pub deposit_note_mint: Account<'info, Mint>,

    #[account(mut)]
    pub deposit_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub reserve: AccountLoader<'info, Reserve>,
}

pub fn handler(ctx: Context<VariableDeposit>, amount: u64) -> ProgramResult {
    Ok(())
}
