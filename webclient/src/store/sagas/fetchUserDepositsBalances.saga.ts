import { Connection, PublicKey } from "@solana/web3.js"
import { getContext, put, select } from "redux-saga/effects"
import { RootState } from ".."
import { SolanaConnectionContext } from "../../solanaConnectionContext"

import { deserializeAccount, getATAAddress } from "@saberhq/token-utils"
import { Reserve } from "../reducer/reserves"
import {
  DepositBalances,
  actions as depositBalanceActions,
} from "../reducer/depositBalances"

async function doFetchUserDepositBalances(
  owner: PublicKey,
  connection: Connection,
  collateralAccounts: PublicKey[],
  reserveMints: PublicKey[],
  depoositNoteMints: PublicKey[]
): Promise<DepositBalances> {
  const atas = await Promise.all(
    depoositNoteMints.map((mint) => getATAAddress({ mint, owner }))
  )

  const xs = await connection.getMultipleAccountsInfo([
    ...atas,
    ...collateralAccounts,
  ])

  const vals = xs.map((x) =>
    deserializeAccount(x?.data as Buffer).amount.toNumber()
  )

  const length = atas.length

  return reserveMints
    .map((x) => x.toBase58())
    .reduce(
      (ac, x, i) => ({
        ...ac,
        [x]: { depositNotes: vals[i], collateral: vals[i + length] },
      }),
      {}
    )
}

export function* fetchUserDepositsBalances() {
  const { wallet, connection } = (yield getContext(
    "solanaConnectionContext"
  )) as SolanaConnectionContext

  if (!wallet || !connection) return

  const state = (yield select()) as RootState

  const collateralAccounts = state.userPortfolio.state.variableDeposits
    .map((x) => x.collateralVaultAccount)
    .map((x) => new PublicKey(x))

  const mints = state.userPortfolio.state.variableDeposits.map((x) => x.token)

  const depositNoteMints = mints
    .map((m) => state.reserves.state.find((r) => r.token === m))
    .filter((x) => !!x)
    .map((r) => (r as Reserve).depositNoteMint)
    .map((x) => new PublicKey(x))

  if (depositNoteMints.length !== mints.length) {
    throw new Error("Missing reserve for variable depo")
  }

  try {
    const balances = (yield doFetchUserDepositBalances(
      wallet.publicKey,
      connection,
      collateralAccounts,
      mints.map((x) => new PublicKey(x)),
      depositNoteMints
    )) as DepositBalances
    yield put(depositBalanceActions.loaded(balances))
  } catch (e: any) {
    console.log(e)
  }
}
