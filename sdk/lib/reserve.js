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
exports.Reserve = void 0;
function settlementTableAccountToState(t) {
    return {
        periods: t.periods.map((p) => ({
            deposited: p.deposited.toNumber(),
            freeInterest: p.freeInterest.toNumber(),
            borrowed: p.borrowed.toNumber(),
        })),
    };
}
class Reserve {
    constructor(program, t, r) {
        this.program = program;
        const RATIO_DENOM = 1000;
        this.market = r.market;
        this.token = r.token;
        this.decimals = r.decimals;
        this.depositNoteMint = r.depositNoteMint;
        this.vault = r.vault;
        this.settlementTableAddress = r.settlementTable;
        this.settlementTable = settlementTableAccountToState(t);
        this.totalDepositNotes = r.totalDepositNotes.toNumber();
        this.totalDepositTokens = r.totalDepositTokens.toNumber();
        this.totalDebt = r.totalDebt.toNumber();
        this.fixedDebt = r.fixedDebt.toNumber();
        this.fixedDeposits = r.fixedDeposits.toNumber();
        this.minBorrowRate = r.minBorrowRate.toNumber() / RATIO_DENOM;
        this.maxBorrowRate = r.maxBorrowRate.toNumber() / RATIO_DENOM;
        this.pivotBorrowRate = r.pivotBorrowRate.toNumber() / RATIO_DENOM;
        this.targetUtilization = r.targetUtilization.toNumber() / RATIO_DENOM;
        this.variablePoolSubsidy = r.variablePoolSubsidy.toNumber() / RATIO_DENOM;
        this.durationFee = r.durationFee.toNumber() / RATIO_DENOM;
    }
    serialize() {
        return {
            market: this.market,
            token: this.token,
            decimals: this.decimals,
            vault: this.vault,
            depositNoteMint: this.depositNoteMint,
            settlementTable: this.settlementTable,
            totalDepositNotes: this.totalDepositNotes,
            totalDepositTokens: this.totalDepositTokens,
            totalDebt: this.totalDebt,
            fixedDebt: this.fixedDebt,
            fixedDeposits: this.fixedDeposits,
            minBorrowRate: this.minBorrowRate,
            maxBorrowRate: this.maxBorrowRate,
            pivotBorrowRate: this.pivotBorrowRate,
            targetUtilization: this.targetUtilization,
            variablePoolSubsidy: this.variablePoolSubsidy,
            durationFee: this.durationFee,
        };
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const t = (yield this.program.account.settlementTable.fetch(this.settlementTableAddress));
            this.settlementTable = settlementTableAccountToState(t);
        });
    }
    utilization() {
        return Reserve.math.utilization(this.totalDebt, this.totalDepositTokens);
    }
    floatingInterestRate() {
        const utilization = this.utilization();
        return Reserve.math.floatingInterestRate(utilization, this.minBorrowRate, this.maxBorrowRate, this.pivotBorrowRate, this.targetUtilization);
    }
    /** Calculate the fixed borrow rate for a hypothetical borrow */
    calcFixedBorrowInterest(amount, duration) {
        const newUtilization = Reserve.math.utilization(this.totalDebt + amount, this.totalDepositTokens);
        const durationFee = this.durationFee * duration;
        const subsidyFee = this.variablePoolSubsidy;
        return (durationFee +
            subsidyFee +
            Reserve.math.floatingInterestRate(newUtilization, this.minBorrowRate, this.maxBorrowRate, this.pivotBorrowRate, this.targetUtilization));
    }
    /** How much interest will a deposit receive? */
    availableInterestForDuration(amount, duration) {
        return Reserve.math.availableInterestForDuration(this.settlementTable, amount, duration);
    }
}
exports.Reserve = Reserve;
Reserve.math = {
    allocatedInterestAmountForPeriod,
    allocatedInterestRateForPeriod,
    availableInterestForDuration,
    floatingInterestRate,
    utilization,
};
function availableInterestForDuration(settlementTable, amount, duration) {
    return settlementTable.periods
        .slice(0, duration)
        .map((p) => 
    // Calculate interest amount factoring in deposit
    allocatedInterestAmountForPeriod(Object.assign(Object.assign({}, p), { deposited: p.deposited + amount })))
        .reduce((a, x) => x + a, 0);
}
function allocatedInterestRateForPeriod(p) {
    // (1 - ratio^2) * (1 - Interest^2) = 1)
    const ratio = p.deposited / p.borrowed;
    return Math.sqrt(1 - 1 / (1 + Math.pow(ratio, 2)));
}
function allocatedInterestAmountForPeriod(p) {
    if (p.borrowed === 0)
        return 0;
    const rate = allocatedInterestRateForPeriod(p);
    return rate * p.freeInterest;
}
/** find the y-value between points a & b at x */
function interpolate(x, a, b) {
    const { x: x0, y: y0 } = a;
    const { x: x1, y: y1 } = b;
    return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
}
function utilization(totalDebt, totalDeposits) {
    return totalDebt / (totalDebt + totalDeposits);
}
function floatingInterestRate(utilization, minBorrowRate, maxBorrowRate, pivotBorrowRate, targetUtilization) {
    if (utilization <= 0) {
        return minBorrowRate;
    }
    if (utilization < targetUtilization) {
        return interpolate(utilization, { x: 0, y: minBorrowRate }, { x: targetUtilization, y: pivotBorrowRate });
    }
    if (utilization < 1) {
        return interpolate(utilization, { x: targetUtilization, y: pivotBorrowRate }, { x: 1, y: maxBorrowRate });
    }
    return maxBorrowRate;
}
