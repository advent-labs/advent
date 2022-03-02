use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::state::*;

#[derive(Accounts)]
pub struct InitVariableDeposit<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    pub market: AccountLoader<'info, Market>,

    #[account(
        init,
        payer=authority,
        token::mint = deposit_note_mint,
        token::authority = market
    )]
    pub collateral_vault_account: Account<'info, TokenAccount>,

    pub reserve: AccountLoader<'info, Reserve>,

    #[account(mut)]
    pub positions: AccountLoader<'info, Positions>,
    pub deposit_note_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<InitVariableDeposit>) -> Result<()> {
    let mut positions = ctx.accounts.positions.load_mut()?;
    let reserve = ctx.accounts.reserve.load()?;

    let variable_deposit = VariableDeposit {
        token: reserve.token,
        collateral_vault_account: ctx.accounts.collateral_vault_account.key(),
        ..Default::default()
    };

    positions.register_variable_deposit(variable_deposit)?;

    Ok(())
}
