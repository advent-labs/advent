use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
pub struct InitPortfolio<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    pub market: AccountLoader<'info, Market>,

    #[account(
        init,
        seeds=[
            b"portfolio".as_ref(),
            market.key().as_ref()
        ],
        bump,
        payer=authority
    )]
    pub portfolio: AccountLoader<'info, Portfolio>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitPortfolio>) -> Result<()> {
    let mut portfolio = ctx.accounts.portfolio.load_init()?;

    portfolio.bump = *ctx.bumps.get("portfolio").unwrap();
    portfolio.authority = ctx.accounts.authority.key();

    Ok(())
}
