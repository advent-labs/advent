use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::state::*;

#[derive(Accounts)]
pub struct InitReserve<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    pub market: AccountLoader<'info, Market>,

    pub token: Account<'info, Mint>,

    #[account(
        init,
        seeds=[
            b"reserve".as_ref(),
            market.key().as_ref(),
            token.key().as_ref()
        ],
        bump,
        payer=authority
    )]
    pub reserve: Account<'info, Reserve>,

    #[account(
        init,
        mint::decimals = 6,
        mint::authority = market,
        payer=authority
    )]
    pub deposit_note_mint: Account<'info, Mint>,

    #[account(
        init,
        seeds=[
            b"vault".as_ref(),
            market.key().as_ref(),
            token.key().as_ref()
        ],
        token::mint=token,
        token::authority=market,
        payer=authority,
        bump
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(zero)]
    pub settlement_table: AccountLoader<'info, SettlementTable>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<InitReserve>, policy: ReservePolicy) -> Result<()> {
    let mut t = ctx.accounts.settlement_table.load_init()?;
    let r = &mut ctx.accounts.reserve;
    msg!("{}", ctx.accounts.settlement_table.key());
    t.reserve = r.key();
    t.market = ctx.accounts.market.key();

    let bump = *ctx.bumps.get("reserve").unwrap();
    r.market = ctx.accounts.market.key();
    r.bump = bump;
    r.policy = policy;
    r.settlement_table = ctx.accounts.settlement_table.key();
    r.token = ctx.accounts.token.key();
    r.deposit_note_mint = ctx.accounts.deposit_note_mint.key();
    r.vault = ctx.accounts.vault.key();

    Ok(())
}
