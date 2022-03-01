use anchor_lang::prelude::*;

use crate::errors::ErrorCode;

#[zero_copy]
#[derive(Default, Debug)]
pub struct ReserveInfo {
    pub reserve: Pubkey,
    pub price: u64,
}

#[account(zero_copy)]
#[derive(Debug, Default)]
pub struct Market {
    pub reward_token_mint: Pubkey,
    pub authority: Pubkey,
    pub quote_token_mint: Pubkey,
    pub quote_token_decimals: u8,
    pub bump: [u8; 1],
    pub reserves: [ReserveInfo; 16],
}
pub type ReserveIndex = u8;

impl Market {
    pub fn register_reserve(&mut self, reserve: &Pubkey) -> Result<ReserveIndex> {
        for (index, entry) in self.reserves.iter_mut().enumerate() {
            if entry.reserve != Pubkey::default() {
                continue;
            }

            entry.reserve = *reserve;

            return Ok(index as ReserveIndex);
        }

        Err(error!(ErrorCode::NoFreeReserves))
    }

    pub fn authority_seeds(&self) -> [&[u8]; 3] {
        [b"main", self.reward_token_mint.as_ref(), &self.bump]
    }
}
