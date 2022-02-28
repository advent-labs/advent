import { displayWithSign } from '../util'

function NetChange({ change }: { change: number }) {
  let signage = 'is-neutral'
  const sign = Math.sign(change)
  if (sign === 0 || sign === -0 || isNaN(sign)) {
    signage = 'is-neutral'
  } else if (sign === 1) {
    signage = 'is-positive'
  } else if (sign === -1) {
    signage = 'is-negative'
  }

  return (
    <div className={`n-tag ${signage} mr-2`}>{change === 0 ? '--' : displayWithSign(change)}</div>
  )
}

export default NetChange
