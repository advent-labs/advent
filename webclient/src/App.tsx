import { store, useAppSelector, useAppDispatch } from "./redux"
import { Provider } from "react-redux"
import { createContext, FC, useMemo, useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import adventAddresses from "./adventAddresses.json"
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react"
import { solanaConnectionContext } from "./solanaConnectionContext"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js"
import { addresses, Addresses } from "./addresses"
import {
  userTokenBalancesStateRequested,
  resetTokenBalances,
} from "./redux/reducer/userTokenBalances"
import Container from "./blocks/Container"
import Balances from "./common/Balances"
import { Dash } from "./pages/dash/Dash"
import Lend from "./pages/deposit/Deposit"
import Borrow from "./pages/borrow/Borrow"
import Nav from "./common/Nav"
import {
  AdventMarket as OldAdventMarket,
  AdventSDK as OldAdventSDK,
} from "./sdk"
import { AdventMarket, AdventSDK } from "@advent/sdk"
import { actions as userPortfolioActions } from "./redux/reducer/userPortfolio"
import { actions as reservesAction } from "./redux/reducer/reserves"
import { ToastContainer } from "react-toastify"
import Portfolio from "./common/Portfolio"

require("@solana/wallet-adapter-react-ui/styles.css")

interface AppContext {
  addresses: Addresses
  sdk?: OldAdventMarket
  adventMarketSDK?: AdventMarket
}

export const Context = createContext<AppContext>({
  addresses: addresses.dev,
})

export const Wrapper: FC = () => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const connection = new Connection(endpoint, "confirmed")
  solanaConnectionContext.connection = connection

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

function App() {
  const wallet = useWallet()
  const dispatch = useAppDispatch()
  const tokenStatus = useAppSelector((state) => state.userTokenAccounts.status)
  const [context, setContext] = useState<AppContext>({
    addresses: addresses.dev,
  })

  useEffect(() => {
    if (!solanaConnectionContext.connection) {
      console.log("Wating for connection")
      return
    }
    const sdk = new AdventSDK(solanaConnectionContext.connection)

    sdk
      .market(new PublicKey(adventAddresses.market))
      .then((adventMarketSDK) => {
        solanaConnectionContext.adventMarketSDK = adventMarketSDK

        setContext({
          adventMarketSDK,
          addresses: addresses.dev,
        })
      })

    new OldAdventSDK().market().then((sdk) => {
      solanaConnectionContext.sdk = sdk

      setContext({
        addresses: addresses.dev,
        sdk,
      })
    })
  }, [solanaConnectionContext.connection])

  useEffect(() => {
    if (!solanaConnectionContext.connection) {
      console.log("Wating for connection")
      return
    }

    solanaConnectionContext.wallet = wallet as any
    if (!wallet.connected) {
      if (tokenStatus === "loaded") {
        dispatch(resetTokenBalances())
      }
    }
  }, [wallet.connected, wallet, dispatch, tokenStatus])

  useEffect(() => {
    if (wallet.connected) {
      if (tokenStatus === "init") {
        dispatch(userTokenBalancesStateRequested())
      }
    }
  }, [wallet.connected, dispatch, tokenStatus])

  useEffect(() => {
    if (!wallet.connected) return
    dispatch(userPortfolioActions.loadRequested())
  }, [wallet.connected, dispatch])

  useEffect(() => {
    if (!solanaConnectionContext.sdk) {
      return
    }
    dispatch(reservesAction.loadRequested())
  }, [context.sdk])

  return (
    <div>
      <div className="columns">
        <div className="column is-9">
          <Nav />
          <Routes>
            <Route path="/" element={<Balances />} />
            <Route path="/dash" element={<Dash />} />
            <Route path="/lend" element={<Lend />} />
            <Route path="/borrow" element={<Borrow />} />
          </Routes>
        </div>
        <Container type="background" id="portfolio" xtra="column is-3">
          <Portfolio />
        </Container>
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="toast"
      />
    </div>
  )
}

export default Wrapper
