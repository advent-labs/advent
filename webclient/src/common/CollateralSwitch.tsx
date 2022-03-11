import { selectAppUIValues, actions } from '../redux/ui/appui'
import { useAppSelector } from '../redux'
import ChangeParameters, { ChangeParameter } from './ChangeParameters'
import Container from '../blocks/Container'
import CoInput from '../blocks/CoInput'
import Switch from '../blocks/Switch'
import Button from '../blocks/Button'

export interface CollateralSwitchProps {
  // parameters: ChangeParameter[]
}

function CollateralSwitch({}: CollateralSwitchProps) {
  const { coInputVal } = useAppSelector(selectAppUIValues)
  const selectedUserReserve = useAppSelector(
    (s) => s.dashboardUI.selectedUserReserve,
  )
  console.log('selected', selectedUserReserve)
  const { icon, uTokenName, mint, data } = selectedUserReserve
  // const { useCollateral, currentCollateral} = selectedUserReserve[]
  const collateralData = data.filter((e, i) => {
    return e.id === 'collateral'
  })[0]
  console.log(collateralData)
  const currentCollateral = collateralData?.value || 0
  const useCollateral = collateralData?.value > 0 || false

  const changeParameters = [
    {
      label: 'Borrow limit used',
      value: 38,
      nextValue: 25,
    },
    {
      label: 'Borrow limit',
      value: 80,
      nextValue: 85,
      square: 'red',
    },
    {
      label: 'Liquidation threshold',
      value: 85,
      nextValue: 88,
      square: 'black',
    },
    {
      label: 'Health factor',
      value: 1.34,
      nextValue: 1.52,
    },
  ]

  return (
    <Container type="background" xtra="collateral-switch center-column">
      <div className="is-flex is-align-items-center mb-5">
        <img src={icon} alt={uTokenName} className="token-size is-large mr-4" />
        <h1 className="text__xl5 is-black">{uTokenName}</h1>
      </div>
      <p className="text__xl3-semi is-black">Use as collateral</p>
      <p className="text__medium-m is-grey-1">
        Each asset used as collateral increases your borrowing limit. Be
        careful, this can subject the asset to being seized in liquidation.
      </p>
      <Container type="light">
        <div className="is-flex mt-2 is-align-items-center">
          <CoInput
            value={coInputVal}
            handleInput={actions.coInputValHasChanged}
            placeholder={currentCollateral.toString()}
          />
          <Switch
            useColl={useCollateral}
            toggle={actions.toggleUseColl}
            xtra="ml-2"
          />
        </div>
        <div>SLIDER</div>
      </Container>
      <ChangeParameters params={changeParameters} />
      <Button
        type="secondary"
        text="Save"
        handler={() => null}
        xtra="mt-4 big-action"
      />
    </Container>
  )
}

export default CollateralSwitch
