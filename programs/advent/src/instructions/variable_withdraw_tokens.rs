use anchor_lang::prelude::*;
use anchor_spl::token::{self, *};

use crate::state::*;

#[derive(Accounts)]
pub struct VariableWithdrawTokens<'info> {
    pub authority: Signer<'info>,

    pub market: AccountLoader<'info, Market>,

    #[account(mut)]
    pub reserve: Box<Account<'info, Reserve>>,

    #[account(mut)]
    pub positions: AccountLoader<'info, Positions>,

    #[account(mut)]
    pub deposit_note_mint: Account<'info, Mint>,

    /// User account holding deposit notes as collateral
    #[account(mut)]
    pub deposit_note_user: Account<'info, TokenAccount>,

    /// Vault holding stored tokens for reserve
    #[account(mut)]
    pub reserve_vault: Account<'info, TokenAccount>,

    /// User's reserve account
    #[account(mut)]
    pub user_reserve: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<VariableWithdrawTokens>, amount: u64) -> Result<()> {
    let reserve = &mut ctx.accounts.reserve;
    let market = ctx.accounts.market.load()?;

    // todo calc notes
    let note_amount = amount;
    reserve.variable_withdraw(amount, note_amount);

    token::transfer(
        ctx.accounts
            .transfer_context()
            .with_signer(&[&market.authority_seeds()]),
        amount,
    )?;

    // TODO - calc notes
    token::burn(ctx.accounts.note_burn_context(), amount)?;

    Ok(())
}

impl<'info> VariableWithdrawTokens<'info> {
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
                to: self.deposit_note_user.to_account_info(),
                mint: self.deposit_note_mint.to_account_info(),
                authority: self.authority.to_account_info(),
            },
        )
    }
}
