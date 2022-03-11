import BalanceBox from '../common/BalanceBox'
import PortMetric from '../common/PortMetric'

function UserSupply() {
  const leftData = {
    label: 'Borrow balance',
    value: 0,
    dollar: true,
    loadedOnce: true,
  }
  const rightData = {
    label: 'Health factor',
    value: 0,
    loadedOnce: true,
  }

  const parameters = [
    {
      label: 'Borrow limit',
      value: 0,
      square: 'red',
    },
    {
      label: 'Liquidation threshold',
      value: 0,
      square: 'black',
    },
  ]

  const displayParameters = parameters.map((e, i) => {
    return <PortMetric {...e} key={i} />
  })

  return (
    <div className="user-supply">
      <h1 className="text__xl6-semi is-white mb-5">My borrow</h1>
      <BalanceBox leftData={leftData} rightData={rightData}>
        {displayParameters}
      </BalanceBox>
    </div>
  )
}

export default UserSupply
