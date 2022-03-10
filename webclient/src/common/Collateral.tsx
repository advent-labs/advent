import Container from '../blocks/Container'
import Switch from '../blocks/Switch'
import TextInput from '../blocks/TextInput'

function Collateral() {
  return (
    <Container type="background" xtra="collateral mt__2 is-full-width br__8">
      <p>Use as collateral</p>
      <div className="is-flex">
        <p>100%</p>
        <Switch />
      </div>
    </Container>
  )
}

export default Collateral
