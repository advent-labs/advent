import { useContext } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Context } from '../App'
import { useAppSelector } from '../store/index'

function WalletBalance({ mint, name }: { mint: string; name: string }) {
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

  const balance = balances[mint] / 10 ** 6 || 0

  return (
    <div className="is-flex is-align-items-center mt-4">
      <p className="text__medium-m is-grey-1">Wallet balance:</p>
      <p className="text__medium-m is-black ml-2">{balance}</p>
      <p className="text__medium-m is-black ml-1">{name}</p>
    </div>
  )
}

export default WalletBalance
