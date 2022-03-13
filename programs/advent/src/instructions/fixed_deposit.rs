use anchor_lang::prelude::*;
use anchor_spl::token::{self, *};

use crate::{state::*, utils::epoch_now};

#[derive(Accounts)]
pub struct FixedDeposit<'info> {
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

pub fn handler(ctx: Context<FixedDeposit>, amount: u64, duration: u64) -> Result<()> {
    let mut positions = ctx.accounts.positions.load_mut()?;
    let mut settlement_table = ctx.accounts.settlement_table.load_mut()?;
    let reserve = &mut ctx.accounts.reserve;

    let start = epoch_now();

    let interest_amount = reserve.calc_fixed_deposit_interest(start, duration, amount);

    let d = crate::state::FixedDeposit {
        token: reserve.token,
        start,
        duration,
        amount,
        interest_amount,
        collateral_amount: amount,
    };

    positions.insert_fixed_deposit(d)?;
    reserve.register_fixed_deposit(amount);
    settlement_table.apply_fixed_deposit(duration as usize, amount);

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
