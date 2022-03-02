use anchor_lang::prelude::*;

mod errors;
mod instructions;
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

    pub fn variable_deposit(ctx: Context<VariableDeposit>, amount: u64) -> Result<()> {
        instructions::variable_deposit::handler(ctx, amount)
    }

    pub fn withdraw_variable_deposit(
        ctx: Context<WithdrawVariableDeposit>,
        amount: u64,
    ) -> Result<()> {
        instructions::withdraw_variable_deposit::handler(ctx, amount)
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
