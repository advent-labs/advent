export function addCommas(number: number | string) {
  const subs = number.toString().split(".")
  const integer = subs[0] ? subs[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0"
  const fixed = subs[1]?.slice(0, 3)
  const decimal = subs[1] ? "." + fixed : ""
  const formatted = integer + decimal
  return formatted
}

export function displayWithSign(number: number) {
  let display = "--"
  const sign = Math.sign(number)
  if (sign === 0 || sign === -0 || isNaN(sign)) {
    display = "--"
  } else if (sign === 1) {
    display = "+" + number.toString() + "%"
  } else if (sign === -1) {
    display = number.toString() + "%"
  }
  return display
}

export function formatPublicKeyDisplay(string: string | undefined) {
  if (!string) {
    return ""
  }
  const chars = 4
  const length = string.length
  const first = string.slice(0, chars)
  const second = string.slice(length - chars)
  const display = first + "..." + second
  return display
}
