import Container from '../blocks/Container'
import Button from '../blocks/Button'

export interface UserAssetProps {
  icon: string
  uTokenName: string
  rate: number
  amount: number
  isFixed: boolean
  isBorrowed: boolean
  time?: string
  interest?: number
  apy?: number
  collateral?: number
  action?: () => void
  moreAction?: () => void
  disabled?: boolean
}

function UserAsset({
  icon,
  uTokenName,
  rate,
  amount,
  isFixed,
  isBorrowed,
  time,
  interest,
  apy,
  collateral,
  action,
  moreAction,
  disabled,
}: UserAssetProps) {
  return (
    <Container type="dark" xtra={'mb-4'}>
      <div className="spread">
        <div className="is-flex is-align-items-center">
          <img src={icon} alt={uTokenName} className="token-size mr-2" />
          <p>{uTokenName}</p>
        </div>
        <p>{time ? time : ' '}</p>
      </div>
      <hr className="is-primary" />
      <div className="spread">
        <p>Rate</p>
        <div className="is-flex">
          <p>{rate}%</p>
          <p>{isFixed ? 'Fixed' : 'Variable'}</p>
        </div>
      </div>
      <div className="spread">
        <p>{isBorrowed ? 'Borrowed' : 'Supplied'}</p>
        <div className="is-flex">
          <p>{amount}</p>
          <p>{uTokenName}</p>
        </div>
      </div>

      {!!interest && (
        <div className="spread">
          <p>Interest at maturity</p>
          <div className="is-flex">
            <p>{interest}</p>
            <p>{uTokenName}</p>
          </div>
        </div>
      )}

      {!!apy && (
        <div className="spread">
          <p>APY {isBorrowed ? 'accrued' : 'earned'} </p>
          <p>{apy}%</p>
        </div>
      )}

      {!isBorrowed && (
        <div className="spread">
          <p>Collateral</p>
          <div className="is-flex">
            <p>{!!collateral && collateral > 0 ? `${collateral}%` : ''}</p>
            <p>{!!collateral && collateral > 0 ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}

      <div className="is-flex">
        <Button
          type="primary"
          text={isBorrowed ? 'Borrow more' : 'Lend more'}
          handler={() => moreAction}
          disabled={disabled}
        />
        <Button
          xtraClass="ml-4"
          type="primary"
          text={isBorrowed ? 'Withdraw' : 'Repay'}
          handler={() => action}
          disabled={disabled}
        />
      </div>
    </Container>
  )
}

export default UserAsset
