import { useContext } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Context } from '../App'
import { useAppSelector } from '../redux/index'

function Balances() {
  const ctx = useContext(Context)
  const wallet = useWallet()
  const connected = wallet.connected
  const { balances, loadedOnce } = useAppSelector(
    (state) => state.userTokenAccounts,
  )

  if (!connected) {
    return <h2 className="mt-4">Connect wallet to view balances</h2>
  }

  if (!wallet.publicKey) {
    return null
  }

  const usdt = balances[ctx.addresses.mintUsdt]
  const usdc = balances[ctx.addresses.mintUsdc]

  const solAddress = wallet.publicKey.toBase58()
  const sol = balances[solAddress]

  return loadedOnce ? (
    <div>
      <h1 className="mt-4">SPL Balances:</h1>
      <div className="is-flex">
        <p>USDT:</p>
        <p className="ml-2">{usdt}</p>
      </div>
      <div className="is-flex">
        <p>USDC:</p>
        <p className="ml-2">{usdc}</p>
      </div>
      <div className="is-flex">
        <p>SOL:</p>
        <p className="ml-2">{sol}</p>
      </div>
    </div>
  ) : (
    <h2 className="mt-4">Loading SPL balances...</h2>
  )
}

export default Balances
