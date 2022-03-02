use anchor_lang::prelude::*;
use anchor_spl::token::{self, *};

use crate::state::*;

#[derive(Accounts)]
pub struct FixedBorrow<'info> {
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

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<WithdrawVariableDeposit>, amount: u64) -> Result<()> {
    let mut positions = ctx.accounts.positions.load_mut()?;
    let mut reserve = ctx.accounts.reserve.load_mut()?;
    let market = ctx.accounts.market.load()?;

    positions.add_variable_deposit(reserve.token, amount, amount)?;

    reserve.deposit(amount);

    token::transfer(
        ctx.accounts
            .transfer_context()
            .with_signer(&[&market.authority_seeds()]),
        amount,
    )?;

    // TODO - calc notes
    token::burn(
        ctx.accounts
            .note_burn_context()
            .with_signer(&[&market.authority_seeds()]),
        amount,
    )?;

    Ok(())
}

impl<'info> WithdrawVariableDeposit<'info> {
    fn transfer_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.reserve_vault.to_account_info(),
                to: self.user_reserve.to_account_info(),
                authority: self.market.to_account_info(),
            },
        )
    }

    fn note_burn_context(&self) -> CpiContext<'_, '_, '_, 'info, Burn<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Burn {
                to: self.deposit_note_vault.to_account_info(),
                mint: self.deposit_note_mint.to_account_info(),
                authority: self.market.to_account_info(),
            },
        )
    }
}
