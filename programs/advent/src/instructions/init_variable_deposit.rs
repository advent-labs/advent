use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::state::*;

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct InitVariableDeposit<'info> {
    pub authority: Signer<'info>,

    pub market: AccountLoader<'info, Main>,

    #[account(
        init,
        seeds=[
            b"deposit-collateral",
            market.key().as_ref(),
            reserve.key().as_ref()
        ],
        bump=bump,
        payer=authority,
        token::mint = deposit_note_mint,
        token::authority = market
    )]
    pub collateral_vault_account: Account<'info, TokenAccount>,

    pub reserve: AccountLoader<'info, Reserve>,

    #[account(mut)]
    pub portfolio: AccountLoader<'info, Portfolio>,
    pub deposit_note_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<InitVariableDeposit>, bump: u8) -> ProgramResult {
    let mut portfolio = ctx.accounts.portfolio.load_mut()?;
    let reserve = ctx.accounts.reserve.load()?;

    let variable_deposit = VariableDeposit {
        token: reserve.token,
        collateral_vault_account: ctx.accounts.collateral_vault_account.key(),
        collateral_vault_account_bump: bump,
        ..Default::default()
    };

    portfolio.register_variable_deposit(variable_deposit)?;

    Ok(())
}
