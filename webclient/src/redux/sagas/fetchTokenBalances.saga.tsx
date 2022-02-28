import { deserializeAccount, getATAAddress } from '@saberhq/token-utils'
import { Connection, PublicKey } from '@solana/web3.js'
import { Addresses } from '../../addresses'
import Toast, { ToastData } from '../../common/Toast'
import { toast } from 'react-toastify'
import { call, getContext, put } from 'redux-saga/effects'
import {
  UserTokenBalances,
  userTokenBalancesStateErrored,
  userTokenBalancesStateLoaded,
} from '../reducer/userTokenBalances'
import { SolanaConnectionContext } from '../../solanaConnectionContext'
import { Wallet } from '@project-serum/anchor/src/provider'

export function* fetchUserTokenBalances() {
  const { connection, wallet, addresses } = (yield getContext(
    'solanaConnectionContext',
  )) as SolanaConnectionContext
  if (!connection || !wallet) return

  try {
    const tokens = (yield call(
      doFetchUserTokenBalances,
      connection,
      wallet,
      addresses,
    )) as {
      splBalances: UserTokenBalances
    }
    yield put(userTokenBalancesStateLoaded(tokens))
  } catch (e: any) {
    yield put(userTokenBalancesStateErrored())
    const toastData: ToastData = {
      title: e.name,
      message: e.message,
      type: 'error',
    }
    toast(<Toast props={toastData} />)
    console.log(e)
  }
}

function deserializeToken(b: Buffer) {
  const ac = deserializeAccount(b)
  return ac.amount.toNumber()
}

async function doFetchUserTokenBalances(
  connection: Connection,
  wallet: Wallet,
  addresses: Addresses,
): Promise<{
  splBalances: UserTokenBalances
}> {
  const { mintUsdc, mintUsdt } = addresses

  const mintAdds = [mintUsdc, mintUsdt]

  const atas = await Promise.all(
    mintAdds
      .map((m) => new PublicKey(m))
      .map((mint) => getATAAddress({ mint, owner: wallet.publicKey })),
  )

  const tokens = await connection.getMultipleAccountsInfo(atas)

  const tokenBalances = tokens.map((x) =>
    x ? deserializeToken(x.data as Buffer) : 0,
  )

  const solMint = wallet.publicKey
  const solBalance = await connection.getBalance(solMint)

  // reduce to map by mint key
  let splBalances = mintAdds.reduce(
    (ac, k, i) => ({ ...ac, [k]: tokenBalances[i] }),
    {},
  )

  const solSPL: UserTokenBalances = { [solMint.toBase58()]: solBalance }

  splBalances = { ...splBalances, ...solSPL }

  return {
    splBalances,
  }
}
