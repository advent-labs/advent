use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod number;
mod state;
mod utils;

use crate::state::ReservePolicy;
use instructions::*;
declare_id!("ke798ave2o7MMZkriRUPSCz1aLrrmPQY2zHdrikJ298");

#[program]
pub mod prog {

    use super::*;

    pub fn init_market(ctx: Context<InitMarket>) -> Result<()> {
        instructions::init_market::handler(ctx)
    }

    pub fn init_portfolio(ctx: Context<InitPortfolio>) -> Result<()> {
        instructions::init_portfolio::handler(ctx)
    }

    pub fn init_variable_deposit(ctx: Context<InitVariableDeposit>) -> Result<()> {
        instructions::init_variable_deposit::handler(ctx)
    }

    pub fn variable_deposit_tokens(ctx: Context<VariableDepositTokens>, amount: u64) -> Result<()> {
        instructions::variable_deposit_tokens::handler(ctx, amount)
    }

    pub fn variable_deposit_collateral(
        ctx: Context<VariableDepositCollateral>,
        amount: u64,
    ) -> Result<()> {
        instructions::variable_deposit_collateral::handler(ctx, amount)
    }

    pub fn variable_withdraw_collateral(
        ctx: Context<VariableWithdrawCollateral>,
        amount: u64,
    ) -> Result<()> {
        instructions::variable_withdraw_collateral::handler(ctx, amount)
    }

    pub fn variable_withdraw_tokens(
        ctx: Context<VariableWithdrawTokens>,
        amount: u64,
    ) -> Result<()> {
        instructions::variable_withdraw_tokens::handler(ctx, amount)
    }

    pub fn fixed_borrow(ctx: Context<FixedBorrow>, amount: u64, duration: u32) -> Result<()> {
        instructions::fixed_borrow::handler(ctx, amount, duration)
    }

    pub fn fixed_deposit(ctx: Context<FixedDeposit>, amount: u64, duration: u32) -> Result<()> {
        instructions::fixed_deposit::handler(ctx, amount, duration)
    }

    pub fn init_reserve(
        ctx: Context<InitReserve>,
        target_utilization: u64,
        borrow_rate_0: u64,
        borrow_rate_1: u64,
    ) -> Result<()> {
        instructions::init_reserve::handler(
            ctx,
            ReservePolicy {
                target_utilization,
                borrow_rate_0,
                borrow_rate_1,
            },
        )
    }
}
