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
exports.AdventMarket = void 0;
const anchor_1 = require("@project-serum/anchor");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const portfolio_1 = require("./portfolio");
const reserve_1 = require("./reserve");
function reserveAccountToClass(r, p, t) {
    return new reserve_1.Reserve(p, t, r);
}
class AdventMarket {
    constructor(program, address, rewardTokenMint, authority, bump, reserves = []) {
        this.program = program;
        this.address = address;
        this.rewardTokenMint = rewardTokenMint;
        this.authority = authority;
        this.bump = bump;
        this.reserves = reserves;
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            this.reserves = yield this.allReserves();
        });
    }
    fetchAllReserves() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.program.account.reserve.all([
                {
                    memcmp: {
                        bytes: anchor_1.utils.bytes.bs58.encode(this.address.toBuffer()),
                        offset: 8,
                    },
                },
            ]);
        });
    }
    fetchAllSettlementTables() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.program.account.settlementTable.all([
                {
                    memcmp: {
                        bytes: anchor_1.utils.bytes.bs58.encode(this.address.toBuffer()),
                        offset: 8,
                    },
                },
            ]);
        });
    }
    portfolio(authority) {
        return __awaiter(this, void 0, void 0, function* () {
            const [a, _] = yield this.portfolioPDA(authority);
            const portfolio = yield this.program.account.portfolio.fetch(a);
            const positions = yield this.fetchPositions(portfolio.positions);
            return new portfolio_1.AdventPortfolio(this.program, a, authority, this, portfolio.positions, positions.variableDeposits, positions.fixedBorrows);
        });
    }
    fetchPositions(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.program.account.positions.fetch(address);
        });
    }
    fetchReserve(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.program.account.reserve.fetch(address));
        });
    }
    fetchSettlmentTable(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.program.account.settlementTable.fetch(address));
        });
    }
    reserve(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const [a, _] = yield this.reservePDA(token);
            const r = yield this.fetchReserve(a);
            const t = r.settlementTable;
            const table = yield this.fetchSettlmentTable(t);
            return reserveAccountToClass(r, this.program, table);
        });
    }
    allReserves() {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.fetchAllReserves();
            const ts = yield this.fetchAllSettlementTables();
            const findTable = (r) => {
                var _a;
                return (_a = ts.find((t) => t.account.reserve.toBase58() === r.toBase58())) === null || _a === void 0 ? void 0 : _a.account;
            };
            return rs.map((r) => reserveAccountToClass(r.account, this.program, findTable(r.publicKey)));
        });
    }
    reserveByToken(token) {
        return this.reserves.find((r) => r.token.equals(token));
    }
    initPositionsIX(authority, positions) {
        return __awaiter(this, void 0, void 0, function* () {
            const space = 6664;
            const lamports = yield this.program.provider.connection.getMinimumBalanceForRentExemption(space);
            return web3_js_1.SystemProgram.createAccount({
                fromPubkey: authority,
                newAccountPubkey: positions,
                space,
                lamports,
                programId: this.program.programId,
            });
        });
    }
    initSettlementTableIX(authority, target) {
        return __awaiter(this, void 0, void 0, function* () {
            const space = 11752;
            const lamports = yield this.program.provider.connection.getMinimumBalanceForRentExemption(space);
            return web3_js_1.SystemProgram.createAccount({
                fromPubkey: authority,
                newAccountPubkey: target,
                space,
                lamports,
                programId: this.program.programId,
            });
        });
    }
    initVariableDepositIX(authority, token, positions, reserveDepositNoteMint) {
        return __awaiter(this, void 0, void 0, function* () {
            const [reserve] = yield this.reservePDA(token);
            const [collateralVaultAccount] = yield this.collateralVaultPDA(reserve, authority);
            return this.program.instruction.initVariableDeposit({
                accounts: {
                    authority,
                    market: this.address,
                    collateralVaultAccount,
                    reserve,
                    positions,
                    depositNoteMint: reserveDepositNoteMint,
                    tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    systemProgram: web3_js_1.SystemProgram.programId,
                    rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                },
            });
        });
    }
    initReserveIX(authority, settlementTable, depositNoteMint, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const [reserve, _] = yield this.reservePDA(token);
            const [vault, _v] = yield this.reserveVaultPDA(token);
            const settlementTableIX = yield this.initSettlementTableIX(authority, settlementTable);
            return [
                settlementTableIX,
                this.program.instruction.initReserve(new anchor_1.BN(0), new anchor_1.BN(0), new anchor_1.BN(0), new anchor_1.BN(0), {
                    accounts: {
                        authority,
                        market: this.address,
                        token,
                        reserve,
                        vault,
                        depositNoteMint,
                        settlementTable,
                        systemProgram: web3_js_1.SystemProgram.programId,
                        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                        rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                    },
                }),
            ];
        });
    }
    initPortfolioIX(authority, positions) {
        return __awaiter(this, void 0, void 0, function* () {
            const [portfolio, _] = yield this.portfolioPDA(authority);
            const positionsIX = yield this.initPositionsIX(authority, positions);
            return [
                positionsIX,
                this.program.instruction.initPortfolio({
                    accounts: {
                        authority,
                        market: this.address,
                        portfolio,
                        positions,
                        systemProgram: web3_js_1.SystemProgram.programId,
                    },
                }),
            ];
        });
    }
    // PDAS
    portfolioPDA(authority) {
        return web3_js_1.PublicKey.findProgramAddress([
            anchor_1.utils.bytes.utf8.encode("portfolio"),
            this.address.toBuffer(),
            authority.toBuffer(),
        ], this.program.programId);
    }
    reservePDA(token) {
        return web3_js_1.PublicKey.findProgramAddress([
            anchor_1.utils.bytes.utf8.encode("reserve"),
            this.address.toBuffer(),
            token.toBuffer(),
        ], this.program.programId);
    }
    reserveVaultPDA(token) {
        return web3_js_1.PublicKey.findProgramAddress([
            anchor_1.utils.bytes.utf8.encode("vault"),
            this.address.toBuffer(),
            token.toBuffer(),
        ], this.program.programId);
    }
    depositNoteMintPDA(token) {
        return web3_js_1.PublicKey.findProgramAddress([
            anchor_1.utils.bytes.utf8.encode("deposit-note-mint"),
            this.address.toBuffer(),
            token.toBuffer(),
        ], this.program.programId);
    }
    collateralVaultPDA(reserve, authority) {
        return web3_js_1.PublicKey.findProgramAddress([
            anchor_1.utils.bytes.utf8.encode("collateral"),
            reserve.toBuffer(),
            authority.toBuffer(),
        ], this.program.programId);
    }
}
exports.AdventMarket = AdventMarket;
