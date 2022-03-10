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
exports.createTokenAccountIX = exports.signAllAndSend = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const anchor_1 = require("@project-serum/anchor");
const program_1 = require("./program");
const errors = (0, anchor_1.parseIdlErrors)(program_1.IDL);
function signAllAndSend(ixs, signers, payer, connection) {
    return __awaiter(this, void 0, void 0, function* () {
        const tx = new web3_js_1.Transaction();
        ixs.forEach((i) => tx.add(i));
        tx.setSigners(...signers.map((s) => s.publicKey));
        const blockhash = yield connection.getRecentBlockhash();
        tx.recentBlockhash = blockhash.blockhash;
        tx.feePayer = payer;
        tx.partialSign(...signers);
        const rawTx = tx.serialize();
        try {
            const sig = yield (0, web3_js_1.sendAndConfirmRawTransaction)(connection, rawTx);
            return sig;
        }
        catch (err) {
            let parsedError = anchor_1.ProgramError.parse(err, errors);
            if (!parsedError) {
                throw err;
            }
            throw parsedError;
        }
    });
}
exports.signAllAndSend = signAllAndSend;
function createTokenAccountIX(connection, newAccountPubkey, mint, owner, payer) {
    return __awaiter(this, void 0, void 0, function* () {
        const lamports = yield connection.getMinimumBalanceForRentExemption(165);
        return [
            web3_js_1.SystemProgram.createAccount({
                fromPubkey: payer,
                newAccountPubkey,
                space: 165,
                lamports,
                programId: spl_token_1.TOKEN_PROGRAM_ID,
            }),
            spl_token_1.Token.createInitAccountInstruction(spl_token_1.TOKEN_PROGRAM_ID, mint, newAccountPubkey, owner),
        ];
    });
}
exports.createTokenAccountIX = createTokenAccountIX;
