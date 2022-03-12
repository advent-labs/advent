use anchor_lang::prelude::*;
use anchor_spl::token::{self, *};

use crate::state::*;

#[derive(Accounts)]
pub struct FixedDeposit<'info> {
    pub authority: Signer<'info>,

    pub market: AccountLoader<'info, Market>,

    #[account(mut)]
    pub reserve: Box<Account<'info, Reserve>>,

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

pub fn handler(ctx: Context<FixedDeposit>, amount: u64, duration: u64) -> Result<()> {
    let mut positions = ctx.accounts.positions.load_mut()?;
    let reserve = &mut ctx.accounts.reserve;
    let market = ctx.accounts.market.load()?;

    token::transfer(ctx.accounts.transfer_context(), amount)?;

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
}
