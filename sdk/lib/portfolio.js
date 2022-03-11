"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AdventPortfolio = void 0;
const web3_js_1 = require("@solana/web3.js");
const sab = __importStar(require("@saberhq/token-utils"));
const anchor_1 = require("@project-serum/anchor");
const spl_token_1 = require("@solana/spl-token");
function serializeVariableDepositAccount(v) {
    return Object.assign(Object.assign({}, v), { amount: v.amount.toNumber() });
}
function serializeVariableBorrowAccount(x) {
    return Object.assign(Object.assign({}, x), { amount: x.amount.toNumber() });
}
function serializeFixedBorrowAccount(x) {
    return Object.assign(Object.assign({}, x), { start: x.start.toNumber(), duration: x.duration.toNumber(), amount: x.amount.toNumber(), interestAmount: x.amount.toNumber() });
}
function serializeFixedDepositAccount(x) {
    return Object.assign(Object.assign({}, x), { start: x.start.toNumber(), duration: x.duration.toNumber(), amount: x.amount.toNumber(), interestAmount: x.amount.toNumber() });
}
class AdventPortfolio {
    constructor(program, address, authority, market, positionsKey, _variableDeposits, _variableBorrows, _fixedDeposits, _fixedBorrows) {
        this.program = program;
        this.address = address;
        this.authority = authority;
        this.market = market;
        this.positionsKey = positionsKey;
        this._variableDeposits = _variableDeposits;
        this._variableBorrows = _variableBorrows;
        this._fixedDeposits = _fixedDeposits;
        this._fixedBorrows = _fixedBorrows;
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const positions = yield this.program.account.positions.fetch(this.positionsKey);
            this._variableDeposits =
                positions.variableDeposits;
            this._fixedBorrows = positions.fixedBorrows;
            this._variableBorrows = positions.variableBorrows;
            this._fixedDeposits = positions.fixedDeposits;
        });
    }
    serialize() {
        return {
            variableDeposits: this.variableDeposits,
            variableBorrows: this.variableBorrows,
            fixedBorrows: this.fixedBorrows,
            fixedDeposits: this.fixedDeposits,
        };
    }
    get variableDeposits() {
        return this._variableDeposits
            .filter((x) => x.token.toBase58() !== web3_js_1.PublicKey.default.toBase58())
            .map(serializeVariableDepositAccount);
    }
    get variableBorrows() {
        return this._variableBorrows
            .filter((x) => x.token.toBase58() !== web3_js_1.PublicKey.default.toBase58())
            .map(serializeVariableBorrowAccount);
    }
    get fixedBorrows() {
        return this._fixedBorrows
            .filter((x) => x.token.toBase58() !== web3_js_1.PublicKey.default.toBase58())
            .map(serializeFixedBorrowAccount);
    }
    get fixedDeposits() {
        return this._fixedDeposits
            .filter((x) => x.token.toBase58() !== web3_js_1.PublicKey.default.toBase58())
            .map(serializeFixedDepositAccount);
    }
    variableDepositTokensIX(token, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const [reserve] = yield this.market.reservePDA(token);
            const [reserveVault] = yield this.market.reserveVaultPDA(token);
            const r = this.reserveByToken(token);
            const reserveUser = yield sab.getATAAddress({
                mint: r.token,
                owner: this.authority,
            });
            const depositNoteUser = yield sab.getATAAddress({
                mint: r.depositNoteMint,
                owner: this.authority,
            });
            const accounts = {
                authority: this.authority,
                market: this.market.address,
                reserve,
                depositNoteMint: r.depositNoteMint,
                reserveVault,
                reserveUser,
                depositNoteUser,
                tokenProgram: sab.TOKEN_PROGRAM_ID,
            };
            return this.program.instruction.variableDepositTokens(new anchor_1.BN(amount), {
                accounts,
            });
        });
    }
    reserveByToken(token) {
        const r = this.market.reserves.find((r) => r.token.toBase58() === token.toBase58());
        if (!r) {
            throw new Error(`No reserve for token ${token.toBase58()}`);
        }
        return r;
    }
    variableDepositCollateralIX(token, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const [reserve] = yield this.market.reservePDA(token);
            const [depositNoteVault] = yield this.market.collateralVaultPDA(reserve, this.authority);
            const r = this.reserveByToken(token);
            const depositNoteUser = yield sab.getATAAddress({
                mint: r.depositNoteMint,
                owner: this.authority,
            });
            return this.program.instruction.variableDepositCollateral(new anchor_1.BN(amount), {
                accounts: {
                    authority: this.authority,
                    market: this.market.address,
                    reserve,
                    positions: this.positionsKey,
                    depositNoteVault,
                    depositNoteUser,
                    tokenProgram: sab.TOKEN_PROGRAM_ID,
                },
            });
        });
    }
    variableWithdrawCollateralIX(token, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const [reserve] = yield this.market.reservePDA(token);
            const [depositNoteVault] = yield this.market.collateralVaultPDA(reserve, this.authority);
            const r = this.reserveByToken(token);
            const depositNoteUser = yield sab.getATAAddress({
                mint: r.depositNoteMint,
                owner: this.authority,
            });
            return this.program.instruction.variableWithdrawCollateral(new anchor_1.BN(amount), {
                accounts: {
                    authority: this.authority,
                    market: this.market.address,
                    reserve,
                    positions: this.positionsKey,
                    depositNoteVault,
                    depositNoteUser,
                    tokenProgram: sab.TOKEN_PROGRAM_ID,
                },
            });
        });
    }
    variableWithdrawTokensIX(token, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const [reserve] = yield this.market.reservePDA(token);
            const r = this.reserveByToken(token);
            const depositNoteUser = yield sab.getATAAddress({
                mint: r.depositNoteMint,
                owner: this.authority,
            });
            const userReserve = yield sab.getATAAddress({
                mint: token,
                owner: this.authority,
            });
            return this.program.instruction.variableWithdrawTokens(new anchor_1.BN(amount), {
                accounts: {
                    authority: this.authority,
                    market: this.market.address,
                    reserve,
                    positions: this.positionsKey,
                    depositNoteMint: r.depositNoteMint,
                    reserveVault: r.vault,
                    userReserve,
                    depositNoteUser,
                    tokenProgram: sab.TOKEN_PROGRAM_ID,
                },
            });
        });
    }
    fixedBorrowIX(token, amount, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            const [reserve] = yield this.market.reservePDA(token);
            const r = this.reserveByToken(token);
            const userReserve = yield sab.getATAAddress({
                mint: token,
                owner: this.authority,
            });
            return this.program.instruction.fixedBorrow(new anchor_1.BN(amount), new anchor_1.BN(duration), {
                accounts: {
                    authority: this.authority,
                    market: this.market.address,
                    reserve,
                    settlementTable: r.settlementTableAddress,
                    portfolio: this.address,
                    positions: this.positionsKey,
                    reserveVault: r.vault,
                    userReserve,
                    tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                },
            });
        });
    }
    collateralVaultByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const [reserve] = yield this.market.reservePDA(token);
            const [collateral] = yield this.market.collateralVaultPDA(reserve, this.authority);
            return collateral;
        });
    }
}
exports.AdventPortfolio = AdventPortfolio;
