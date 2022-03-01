use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};

use crate::state::*;

#[derive(Accounts)]
pub struct InitMarket<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        seeds = [
            b"market".as_ref(),
            reward_token_mint.key().as_ref(),
        ],
        bump,
        payer = authority,
    )]
    pub market: AccountLoader<'info, Market>,

    #[account(
        init,
        payer = authority,
        mint::decimals = 6,
        mint::authority = market
    )]
    pub reward_token_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<InitMarket>) -> Result<()> {
    let mut main = ctx.accounts.market.load_init()?;
    let bump = ctx.bumps.get("market").unwrap();
    main.bump = [*bump];
    main.reward_token_mint = ctx.accounts.reward_token_mint.key();
    main.authority = ctx.accounts.authority.key();

    Ok(())
}
