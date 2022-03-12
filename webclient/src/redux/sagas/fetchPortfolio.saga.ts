import { AdventMarket, AdventPortfolio, IPortfolio } from "@advent/sdk"
import { PublicKey } from "@solana/web3.js"
import { getContext, put } from "redux-saga/effects"
import { Portfolio } from "../../sdk/models"
import { SolanaConnectionContext } from "../../solanaConnectionContext"
import {
  actions as userPortfolioActions,
  defaultPortfolio,
  FixedBorrow,
  FixedDeposit,
  UserPortfolio,
  VariableBorrow,
  VariableDeposit,
} from "../reducer/userPortfolio"

export function serializePortfolio(p: IPortfolio): UserPortfolio {
  const epochToSeconds = (e: number) => e * 24 * 60 * 60

  const fixedDeposits: FixedDeposit[] = p.fixedDeposits.map((x) => ({
    startTime: epochToSeconds(x.start),
    endTime: epochToSeconds(x.start + x.duration),
    interestAmount: x.interestAmount,
    amount: x.amount,
    token: x.token.toBase58(),
  }))

  const fixedBorrows: FixedBorrow[] = p.fixedBorrows.map((x) => ({
    startTime: epochToSeconds(x.start),
    endTime: epochToSeconds(x.start + x.duration),
    interestAmount: x.interestAmount,
    amount: x.amount,
    token: x.token.toBase58(),
  }))

  const variableDeposits: VariableDeposit[] = p.variableDeposits.map((x) => ({
    token: x.token.toBase58(),
    collateralAmount: x.collateralAmount,
    collateralVaultAccount: x.collateralVaultAccount.toBase58(),
  }))

  const variableBorrows: VariableBorrow[] = p.variableBorrows.map((x) => ({
    token: x.token.toBase58(),
    notes: x.amount,
  }))

  return {
    fixedBorrows,
    fixedDeposits,
    variableBorrows,
    variableDeposits,
    positionsAddress: p.positionsAddress.toBase58(),
  }
}

export function* fetchUserPortfolio() {
  const { adventMarketSDK, wallet } = (yield getContext(
    "solanaConnectionContext"
  )) as SolanaConnectionContext

  if (!wallet) return
  if (!adventMarketSDK) return

  let p: UserPortfolio

  try {
    const portfolio = (yield adventMarketSDK.portfolio(
      wallet.publicKey
    )) as AdventPortfolio
    const sdkPortfolio = portfolio.serialize()
    p = serializePortfolio(sdkPortfolio)
  } catch {
    // Portfolio not initialied for user yet
    console.log("Portfolio not initialized")
    p = defaultPortfolio
  }

  yield put(userPortfolioActions.loaded(p))
}
