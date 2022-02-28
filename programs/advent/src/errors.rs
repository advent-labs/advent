use anchor_lang::prelude::*;

#[error]
pub enum ErrorCode {
    #[msg("no free space left to add a new reserve in the market")]
    NoFreeReserves,

    #[msg("no free space left to add a new variable deposit to the portfolio")]
    NoFreeVariableDeposits,

    #[msg("no free space left to add a new fixed borrow to the portfolio")]
    NoFreeFixedBorrow,

    #[msg("unregistered variable deposit")]
    UnregisteredVariableDeposit,
}
