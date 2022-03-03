use anchor_lang::prelude::*;
use anchor_spl::token::{self, *};

use crate::state::*;

#[derive(Accounts)]
pub struct VariableDepositTokens<'info> {
    pub authority: Signer<'info>,

    pub market: AccountLoader<'info, Market>,

    #[account(mut)]
    pub reserve: AccountLoader<'info, Reserve>,

    #[account(mut)]
    pub deposit_note_mint: Account<'info, Mint>,

    /// User's account holding deposit notes
    #[account(mut)]
    pub deposit_note_user: Account<'info, TokenAccount>,

    /// Vault holding stored tokens for reserve
    #[account(mut)]
    pub reserve_vault: Account<'info, TokenAccount>,

    /// User's token account
    #[account(mut)]
    pub reserve_user: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<VariableDepositTokens>, amount: u64) -> Result<()> {
    let mut reserve = ctx.accounts.reserve.load_mut()?;
    let market = ctx.accounts.market.load()?;

    // TODO - calc notes
    reserve.variable_deposit(amount, amount);

    token::transfer(ctx.accounts.transfer_context(), amount)?;

    token::mint_to(
        ctx.accounts
            .note_mint_context()
            .with_signer(&[&market.authority_seeds()]),
        amount,
    )?;

    Ok(())
}

impl<'info> VariableDepositTokens<'info> {
    fn transfer_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.reserve_user.to_account_info(),
                to: self.reserve_vault.to_account_info(),
                authority: self.authority.to_account_info(),
            },
        )
    }

    fn note_mint_context(&self) -> CpiContext<'_, '_, '_, 'info, MintTo<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            MintTo {
                to: self.deposit_note_user.to_account_info(),
                mint: self.deposit_note_mint.to_account_info(),
                authority: self.market.to_account_info(),
            },
        )
    }
}
