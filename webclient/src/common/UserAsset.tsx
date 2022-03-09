import { AssetDataPointProps } from './AssetDataPoint'
import AssetDataPoint from './AssetDataPoint'

export interface UserAssetProps {
  icon: string
  uTokenName: string
  assetDataPoints: AssetDataPointProps[]
}

function UserAsset({ icon, uTokenName, assetDataPoints }: UserAssetProps) {
  const displayData = assetDataPoints.map((e, i) => {
    return <AssetDataPoint {...e} key={i} />
  })

  return (
    <div className="user-asset">
      <div className="spread">
        <div className="is-flex is-align-items-center">
          <img src={icon} alt={uTokenName} className="token-size mr-2" />
          <p className="text__large-m is-black">{uTokenName}</p>
        </div>
      </div>
      <hr className="is-grey mt-2" />
      {displayData}
    </div>
  )
}

export default UserAsset
