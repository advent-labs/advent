use std::ops::{Add, AddAssign, Div, DivAssign, Mul, MulAssign, Sub, SubAssign};

use anchor_lang::prelude::*;

const PRECISION: i32 = 10;
const ONE: i128 = 10_000_000_000;

const POWERS_OF_TEN: &'static [i128] = &[
    1,
    10,
    100,
    1_000,
    10_000,
    100_000,
    1_000_000,
    10_000_000,
    100_000_000,
    1_000_000_000,
    10_000_000_000,
    100_000_000_000,
    1_000_000_000_000,
];

/// A fixed-point decimal number 128 bits wide
#[derive(
    Default, AnchorDeserialize, AnchorSerialize, Debug, Copy, Clone, Eq, PartialEq, Ord, PartialOrd,
)]
pub struct Number {
    val: i128,
}

impl Number {
    pub const ONE: Self = Self { val: ONE };
    pub const ZERO: Self = Self { val: 0 };
    pub fn new(val: i128) -> Number {
        Number { val }
    }
    /// Convert this number to fit in a u64
    ///
    /// The precision of the number in the u64 is based on the
    /// exponent provided.
    pub fn as_u64(&self, exponent: impl Into<i32>) -> u64 {
        let extra_precision = PRECISION + exponent.into();
        let mut prec_value = POWERS_OF_TEN[extra_precision.abs() as usize];

        if extra_precision < 0 {
            prec_value = ONE / prec_value;
        }

        let target_value = self.val / prec_value;
        if target_value > std::u64::MAX as i128 {
            panic!("cannot convert to u64 due to overflow");
        }

        if target_value < 0 {
            panic!("cannot convert to u64 because value < 0");
        }

        target_value as u64
    }

    /// Convert another integer
    pub fn from_decimal(value: impl Into<i128>, exponent: impl Into<i32>) -> Self {
        let extra_precision = PRECISION + exponent.into();
        let mut prec_value = POWERS_OF_TEN[extra_precision.abs() as usize];

        if extra_precision < 0 {
            prec_value = ONE / prec_value;
        }

        Self::new(value.into() * prec_value)
    }
}

impl std::fmt::Display for Number {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        // todo optimize
        let rem = self.val % ONE;
        let decimal_digits = PRECISION as usize;
        let rem_str = rem.to_string();
        // regular padding like {:010} doesn't work with U192
        let decimals = "0".repeat(decimal_digits - rem_str.len()) + &*rem_str;
        let stripped_decimals = decimals.trim_end_matches('0');
        let pretty_decimals = if stripped_decimals.is_empty() {
            "0"
        } else {
            stripped_decimals
        };
        if self.val < ONE {
            write!(f, "0.{}", pretty_decimals)?;
        } else {
            let int = self.val / ONE;
            write!(f, "{}.{}", int, pretty_decimals)?;
        }
        Ok(())
    }
}

impl Add<Number> for Number {
    type Output = Self;

    fn add(self, rhs: Number) -> Self::Output {
        Self::new(self.val.checked_add(rhs.val).unwrap())
    }
}

impl AddAssign<Number> for Number {
    fn add_assign(&mut self, rhs: Number) {
        self.val = self.val.checked_add(rhs.val).unwrap();
    }
}

impl Sub<Number> for Number {
    type Output = Self;

    fn sub(self, rhs: Number) -> Self::Output {
        Self::new(self.val.checked_sub(rhs.val).unwrap())
    }
}

impl SubAssign<Number> for Number {
    fn sub_assign(&mut self, rhs: Number) {
        self.val = self.val.checked_sub(rhs.val).unwrap();
    }
}

impl Mul<Number> for Number {
    type Output = Number;

    fn mul(self, rhs: Number) -> Self::Output {
        Self::new(self.val.checked_mul(rhs.val).unwrap().div(ONE))
    }
}

impl MulAssign<Number> for Number {
    fn mul_assign(&mut self, rhs: Number) {
        self.val.mul_assign(rhs.val);
        self.val.div_assign(ONE);
    }
}

impl Div<Number> for Number {
    type Output = Number;

    fn div(self, rhs: Number) -> Self::Output {
        Self::new(self.val.mul(ONE).div(rhs.val))
    }
}

impl DivAssign<Number> for Number {
    fn div_assign(&mut self, rhs: Number) {
        self.val.mul_assign(ONE);
        self.val.div_assign(rhs.val);
    }
}

impl<T: Into<i128>> Mul<T> for Number {
    type Output = Number;

    fn mul(self, rhs: T) -> Self::Output {
        Self::new(self.val.mul(rhs.into()))
    }
}

impl<T: Into<i128>> Div<T> for Number {
    type Output = Number;

    fn div(self, rhs: T) -> Self::Output {
        Self::new(self.val.div(rhs.into()))
    }
}

impl<T: Into<i128>> From<T> for Number {
    fn from(n: T) -> Number {
        Number::new(n.into() * ONE)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn zero_equals_zero() {
        assert_eq!(Number::ZERO, Number::from_decimal(0, 0));
    }

    #[test]
    fn one_equals_one() {
        assert_eq!(Number::ONE, Number::from_decimal(1, 0));
    }

    #[test]
    fn one_plus_one_equals_two() {
        assert_eq!(Number::from_decimal(2, 0), Number::ONE + Number::ONE);
    }

    #[test]
    fn one_minus_one_equals_zero() {
        assert_eq!(Number::ONE - Number::ONE, Number::ZERO);
    }

    #[test]
    fn one_times_one_equals_one() {
        assert_eq!(Number::ONE, Number::ONE * Number::ONE);
    }

    #[test]
    fn one_divided_by_one_equals_one() {
        assert_eq!(Number::ONE, Number::ONE / Number::ONE);
    }

    #[test]
    fn ten_div_100_equals_point_1() {
        assert_eq!(
            Number::from_decimal(1, -1),
            Number::from_decimal(1, 1) / Number::from_decimal(100, 0)
        );
    }

    #[test]
    fn multiply_by_u64() {
        assert_eq!(
            Number::from_decimal(3, 1),
            Number::from_decimal(1, 1) * 3u64
        )
    }
}
