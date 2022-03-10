import { selectAppUIValues, actions } from '../redux/ui/appui'
import { useAppSelector } from '../redux'
import Container from '../blocks/Container'
import Switch from '../blocks/Switch'
import CoInput from '../blocks/CoInput'

function Collateral() {
  const { coInputVal, useCollateral } = useAppSelector(selectAppUIValues)
  return (
    <Container
      type="background"
      xtra="collateral mt__2 is-full-width br__8 center-text"
    >
      <p className="text__medium-m is-grey-1">Use as collateral</p>

      <div className="is-flex mt-2 is-align-items-center">
        <CoInput
          value={coInputVal}
          handleInput={actions.coInputValHasChanged}
        />
        <Switch
          useColl={useCollateral}
          toggle={actions.toggleUseColl}
          xtra="ml-2"
        />
      </div>
    </Container>
  )
}

export default Collateral
