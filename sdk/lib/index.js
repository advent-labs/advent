"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdventSDK = exports.Reserve = exports.AdventMarket = exports.AdventPortfolio = void 0;
const anchor_1 = require("@project-serum/anchor");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const program_1 = require("./program");
const portfolio_1 = require("./portfolio");
Object.defineProperty(exports, "AdventPortfolio", { enumerable: true, get: function () { return portfolio_1.AdventPortfolio; } });
const reserve_1 = require("./reserve");
Object.defineProperty(exports, "Reserve", { enumerable: true, get: function () { return reserve_1.Reserve; } });
const market_1 = require("./market");
Object.defineProperty(exports, "AdventMarket", { enumerable: true, get: function () { return market_1.AdventMarket; } });
const DEFAULT_PROGRAM_ID = "ke798ave2o7MMZkriRUPSCz1aLrrmPQY2zHdrikJ298";
class AdventSDK {
    constructor(connection, program = DEFAULT_PROGRAM_ID) {
        this.connection = connection;
        // const wallet = new Wallet(Keypair.generate())
        const provider = new anchor_1.Provider(this.connection, { publicKey: web3_js_1.Keypair.generate().publicKey }, anchor_1.Provider.defaultOptions());
        this.program = new anchor_1.Program(program_1.IDL, new web3_js_1.PublicKey(program), provider);
    }
    market(marketAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const m = (yield this.program.account.market.fetch(marketAddress));
            const market = new market_1.AdventMarket(this.program, marketAddress, m.rewardTokenMint, m.authority, m.bump[0]);
            yield market.refresh();
            return market;
        });
    }
    initMarketIX(authority, rewardTokenMint) {
        return __awaiter(this, void 0, void 0, function* () {
            const [market, bump] = yield this.marketPDA(rewardTokenMint);
            return this.program.instruction.initMarket({
                accounts: {
                    authority,
                    market,
                    rewardTokenMint,
                    tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    systemProgram: web3_js_1.SystemProgram.programId,
                    rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                },
            });
        });
    }
    // PDAS //
    marketPDA(rewardMint) {
        return web3_js_1.PublicKey.findProgramAddress([anchor_1.utils.bytes.utf8.encode("market"), rewardMint.toBuffer()], this.program.programId);
    }
}
exports.AdventSDK = AdventSDK;
