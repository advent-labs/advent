use anchor_lang::prelude::*;
use anchor_spl::token::{self, *};

use crate::{state::*, utils::epoch_now};

#[derive(Accounts)]
pub struct FixedBorrow<'info> {
    pub authority: Signer<'info>,

    pub market: AccountLoader<'info, Market>,

    #[account(mut)]
    pub reserve: Box<Account<'info, Reserve>>,

    #[account(mut)]
    pub settlement_table: AccountLoader<'info, SettlementTable>,

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

pub fn handler(ctx: Context<FixedBorrow>, amount: u64, duration: u64) -> Result<()> {
    let mut positions = ctx.accounts.positions.load_mut()?;
    let mut settlement_table = ctx.accounts.settlement_table.load_mut()?;
    let reserve = &mut ctx.accounts.reserve;
    let market = ctx.accounts.market.load()?;

    let fb = reserve.make_fixed_borrow(epoch_now(), duration, amount);

    reserve.fixed_borrow(
        &mut settlement_table,
        duration as usize,
        amount,
        fb.interest_amount,
    );

    positions.add_fixed_borrow(fb)?;
    msg!("{}", positions.fixed_borrows[0].token);
    token::transfer(
        ctx.accounts
            .transfer_context()
            .with_signer(&[&market.authority_seeds()]),
        amount,
    )?;

    Ok(())
}

impl<'info> FixedBorrow<'info> {
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
}
