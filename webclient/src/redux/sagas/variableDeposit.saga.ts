import { AdventMarket } from "@advent/sdk"
import { Wallet } from "@project-serum/anchor"
import { PayloadAction } from "@reduxjs/toolkit"
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"
import { getContext, select } from "redux-saga/effects"
import { RootState } from ".."
import { SolanaConnectionContext } from "../../solanaConnectionContext"
import { Reserve } from "../reducer/reserves"
import { selectors as portfolioSelectors } from "../reducer/userPortfolio"
import { selectors as reservesSelectors } from "../reducer/reserves"
import { getOrCreateATA, signAllAndSend } from "./common"
import { getATAAddress } from "@saberhq/token-utils"

async function doVariableDeposit(
  amount: number,
  connection: Connection,
  sdk: AdventMarket,
  reserve: Reserve,
  wallet: Wallet,
  depositInitialized: boolean,
  positionsAddress?: PublicKey
) {
  const ixs: TransactionInstruction[] = []
  const additionalSigners: Keypair[] = []
  const token = new PublicKey(reserve.token)
  const depositNoteMint = new PublicKey(reserve.depositNoteMint)
  console.log(sdk)
  let newPositions: Keypair | undefined = undefined

  // get ATA for deposit notes
  {
    const { instruction } = await getOrCreateATA({
      connection,
      mint: depositNoteMint,
      owner: wallet.publicKey,
    })
    if (instruction) {
      ixs.push(instruction)
    }
  }

  // if no positions address - then portfolio has not been initialized
  if (!positionsAddress) {
    newPositions = Keypair.generate()
    const initPortfolioIXs = await sdk.initPortfolioIX(
      wallet.publicKey,
      newPositions.publicKey
    )
    initPortfolioIXs.forEach((ix) => ixs.push(ix))
    additionalSigners.push(newPositions)
  }

  // if positions was passed in, keep it.  otherwise use the new one
  positionsAddress = positionsAddress
    ? positionsAddress
    : newPositions?.publicKey

  // if the seed account holding the variable deposit has not been created, add it
  if (!depositInitialized) {
    const ix = await sdk.initVariableDepositIX(
      wallet.publicKey,
      token,
      positionsAddress as PublicKey,
      depositNoteMint
    )
    ixs.push(ix)
  }

  const ix = await sdk.variableDepositTokensIX(token, amount, wallet.publicKey)
  ixs.push(ix)

  await signAllAndSend(ixs, wallet, connection, additionalSigners)
}

export function* variableDeposit(
  action: PayloadAction<{ token: string; amount: number }>
) {
  const { token, amount } = action.payload
  const { adventMarketSDK, wallet, connection } = (yield getContext(
    "solanaConnectionContext"
  )) as SolanaConnectionContext

  if (!wallet || !adventMarketSDK || !connection) return

  const state = (yield select()) as RootState

  const isPortfolioInitalized = portfolioSelectors.isPortfolioInitialized(
    state.userPortfolio
  )
  const isVariableDepositInitialized =
    portfolioSelectors.isVariableDepositInitialized(state.userPortfolio)(token)

  const reserve = reservesSelectors.selectReserveByToken(token)(state)

  if (!reserve) {
    throw new Error(`Unable to find reserve for ${token}`)
  }

  const positionsAddress = isPortfolioInitalized
    ? new PublicKey(state.userPortfolio.state.positionsAddress)
    : undefined
  try {
    yield doVariableDeposit(
      amount,
      connection,
      adventMarketSDK,
      reserve,
      wallet as Wallet,
      isVariableDepositInitialized,
      positionsAddress
    )
  } catch (e: any) {
    console.log(e)
  }
}
