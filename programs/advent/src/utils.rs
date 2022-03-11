use std::convert::TryInto;

use anchor_lang::prelude::*;

pub fn epoch_now() -> u64 {
    let now = Clock::get().unwrap().unix_timestamp;
    epoch(now)
}

/// Calculate which epoch (day) it is
/// The epoch is a monotonically increasing index of the settlement period
pub fn epoch(now: i64) -> u64 {
    // One day
    let duration = 24 * 60 * 60;

    (now / duration).unsigned_abs().try_into().unwrap()
}
