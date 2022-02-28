use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

use crate::state::Main;

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct InitMain<'info> {
    pub authority: Signer<'info>,

    #[account(
        init,
        seeds = [
            b"main".as_ref(),
            reward_token_mint.key().as_ref()
        ],
        payer = authority,
        bump = bump
    )]
    pub main: AccountLoader<'info, Main>,

    pub reward_token_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitMain>, bump: u8) -> ProgramResult {
    let mut main = ctx.accounts.main.load_init()?;

    main.bump = bump;
    main.reward_token_mint = ctx.accounts.reward_token_mint.key();
    main.authority = ctx.accounts.authority.key();

    Ok(())
}
