export interface Price {
  // price USD
  val: number
  // percentage change 24h
  change24h: number
}

export enum TokenID {
  usdt,
  usdc,
  sol,
  msol,
}

export type Prices = {
  [k in TokenID]: Price
}

interface CGReturn {
  usd: number
  usd_24h_change: number
}

export interface IRealworldService {
  getAllTokens(): Promise<Prices>
}

export class RealWorldServiceFake implements IRealworldService {
  async getAllTokens() {
    return {
      [TokenID.usdt]: { val: 1, change24h: 1 },
      [TokenID.usdc]: { val: 1, change24h: 1 },
      [TokenID.sol]: { val: 200, change24h: 1 },
      [TokenID.msol]: { val: 200, change24h: 1 },
    }
  }
}

export class RealWorldServiceCoinGecko implements IRealworldService {
  async getAllTokens(): Promise<Prices> {
    return {
      [TokenID.msol]: { val: 1, change24h: 0 },
      [TokenID.sol]: { val: 80, change24h: 0 },
      [TokenID.usdc]: { val: 1, change24h: 0 },
      [TokenID.usdt]: { val: 1, change24h: 0 },
    }
  }
}
