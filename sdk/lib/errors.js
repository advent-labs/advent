"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseError = exports.IDLERRORS = void 0;
const anchor_1 = require("@project-serum/anchor");
const program_1 = require("./program");
exports.IDLERRORS = (0, anchor_1.parseIdlErrors)(program_1.IDL);
function parseError(err) {
    let parsedErr = anchor_1.ProgramError.parse(err, exports.IDLERRORS);
    return parsedErr;
}
exports.parseError = parseError;
