import { NATIVE_MINT } from "@solana/spl-token"
import { TokenID } from "./realworld.service"
import a from "./addresses.json"
import usdcIcon from "./assets/usdc.svg"
import usdtIcon from "./assets/usdt.svg"
import solIcon from "./assets/sol.svg"

export interface Addresses {
  mintUsdc: string
  mintUsdt: string
  mintMetaMap: MintMetaMap
}

export interface MintMeta {
  name: string
  decimals: number
  address: string
  priceID: TokenID
  icon: string
}

export type MintMetaMap = { [mint: string]: MintMeta }

const USDC_DEV = a.mintUsdc
const USDT_DEV = a.mintUsdt
const UST_DEV = a.mintUST
const FRAX_DEV = a.mintFrax

const SOL = NATIVE_MINT.toBase58()

export const mints: { dev: MintMetaMap } = {
  dev: {
    [a.mintUsdc]: {
      name: "USDC",
      decimals: 6,
      address: USDC_DEV,
      priceID: TokenID.usdc,
      icon: usdcIcon,
    },
    [a.mintUsdt]: {
      name: "USDT",
      decimals: 6,
      address: USDT_DEV,
      priceID: TokenID.usdt,
      icon: usdtIcon,
    },
    [a.mintUST]: {
      name: "UST",
      decimals: 6,
      address: UST_DEV,
      priceID: TokenID.usdt,
      icon: usdtIcon,
    },
    [a.mintFrax]: {
      name: "FRAX",
      decimals: 6,
      address: FRAX_DEV,
      priceID: TokenID.usdt,
      icon: usdtIcon,
    },
    [SOL]: {
      name: "SOL",
      decimals: 9,
      address: SOL,
      priceID: TokenID.sol,
      icon: solIcon,
    },
  },
}

interface Faucets {
  usdtFaucet: string
  usdcFaucet: string
}

export const devFaucets: Faucets = {
  usdtFaucet: "9zTnAGkYZSBAECLXYBqyisyUJiZaundV36FjVg5g61ev",
  usdcFaucet: "ETAxYSigjMYiJnKkYsZCK3FnT1Grot8ejtE4d2CarmQU",
}

export const addresses: { dev: Addresses } = {
  dev: {
    ...a,

    mintMetaMap: mints.dev,
  },
}
