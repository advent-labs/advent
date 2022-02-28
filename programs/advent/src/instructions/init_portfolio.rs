use anchor_lang::prelude::*;

use crate::state::{Main, Portfolio};

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct InitPortfolio<'info> {
    pub authority: Signer<'info>,
    pub market: AccountLoader<'info, Main>,

    #[account(
        init,
        seeds=[
            b"portfolio".as_ref(),
            market.key().as_ref()
        ],
        bump=bump,
        payer=authority
    )]
    pub portfolio: AccountLoader<'info, Portfolio>,
    pub system_program: Program<'info, System>,
}

pub fn handle(ctx: Context<InitPortfolio>, bump: u8) -> ProgramResult {
    let mut portfolio = ctx.accounts.portfolio.load_init()?;

    portfolio.bump = bump;
    portfolio.authority = ctx.accounts.authority.key();

    Ok(())
}
