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
            market.key().as_ref(),
            authority.key().as_ref()
        ],
        bump,
        payer=authority
    )]
    pub portfolio: Account<'info, Portfolio>,

    #[account(zero)]
    pub positions: AccountLoader<'info, Positions>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitPortfolio>) -> Result<()> {
    ctx.accounts.positions.load_init()?;
    let portfolio = &mut ctx.accounts.portfolio;

    portfolio.bump = *ctx.bumps.get("portfolio").unwrap();
    portfolio.authority = ctx.accounts.authority.key();
    portfolio.positions = ctx.accounts.positions.key();

    Ok(())
}
