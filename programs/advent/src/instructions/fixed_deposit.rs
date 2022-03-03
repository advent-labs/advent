use anchor_lang::prelude::*;
use anchor_spl::token::{self, *};

use crate::state::*;

#[derive(Accounts)]
pub struct FixedDeposit<'info> {
    pub authority: Signer<'info>,

    pub market: AccountLoader<'info, Market>,

    #[account(mut)]
    pub reserve: AccountLoader<'info, Reserve>,

    pub portfolio: Account<'info, Portfolio>,

    #[account(mut)]
    pub positions: AccountLoader<'info, Positions>,

    /// Vault holding stored tokens for reserve
    #[account(mut)]
    pub reserve_vault: Account<'info, TokenAccount>,

    /// User's reserve account
    #[account(mut)]
    pub user_reserve: Account<'info, TokenAccount>,

    #[account(mut)]
    pub deposit_note_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub deposit_note_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<FixedDeposit>, amount: u64, duration: u32) -> Result<()> {
    let mut positions = ctx.accounts.positions.load_mut()?;
    let mut reserve = ctx.accounts.reserve.load_mut()?;
    let market = ctx.accounts.market.load()?;

    token::transfer(ctx.accounts.transfer_context(), amount)?;

    // Mint deposit notes to a vault
    // this is for accounting purposes, so that the note-to-token exchange rate stays balanced
    token::mint_to(
        ctx.accounts
            .note_mint_context()
            .with_signer(&[&market.authority_seeds()]),
        amount,
    )?;

    Ok(())
}

impl<'info> FixedDeposit<'info> {
    fn transfer_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.user_reserve.to_account_info(),
                to: self.reserve_vault.to_account_info(),
                authority: self.market.to_account_info(),
            },
        )
    }

    fn note_mint_context(&self) -> CpiContext<'_, '_, '_, 'info, MintTo<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            MintTo {
                to: self.deposit_note_vault.to_account_info(),
                mint: self.deposit_note_mint.to_account_info(),
                authority: self.market.to_account_info(),
            },
        )
    }
}
