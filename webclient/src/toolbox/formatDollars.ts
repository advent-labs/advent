export function formatDollars(number: number) {
  const fixed = number.toFixed(2)
  const replaced = fixed ? fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0"
  const formatted = `$${replaced}`
  return formatted
}
