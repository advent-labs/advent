import BalanceBox from '../common/BalanceBox'
import PortMetric from '../common/PortMetric'

function UserSupply() {
  const leftData = {
    label: 'Supply balance',
    value: 0,
    dollar: true,
    loadedOnce: true,
  }
  const rightData = {
    label: 'Net APY',
    value: 0,
    currency: '%',
    loadedOnce: true,
  }

  const parameters = [
    {
      label: 'Borrow limit',
      value: 0,
      square: 'red',
    },
  ]

  const displayParameters = parameters.map((e, i) => {
    return <PortMetric {...e} key={i} />
  })

  return (
    <div className="user-supply">
      <h1 className="text__xl6-semi is-white mb-5">My supply</h1>
      <BalanceBox leftData={leftData} rightData={rightData}>
        {displayParameters}
      </BalanceBox>
    </div>
  )
}

export default UserSupply
