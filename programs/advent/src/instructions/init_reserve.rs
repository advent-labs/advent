use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
pub struct InitReserve<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    pub market: AccountLoader<'info, Market>,

    #[account(
        init,
        seeds=[
            b"reserve".as_ref(),
            market.key().as_ref()
        ],
        bump,
        payer=authority
    )]
    pub reserve: AccountLoader<'info, Reserve>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitReserve>, policy: ReservePolicy) -> Result<()> {
    let mut r = ctx.accounts.reserve.load_init()?;
    let bump = *ctx.bumps.get("reserve").unwrap();
    r.market = ctx.accounts.market.key();
    r.bump = bump;
    r.policy = policy;

    Ok(())
}
