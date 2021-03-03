"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = exports.calculateWorkingCapitalRatio = exports.calculateNetProfitMargin = exports.calculateGrossProfitMargin = exports.calculateExpenses = exports.calculateRevenue = void 0;
const data_json_1 = __importDefault(require("./data.json"));
function accumulateFiltering(filter) {
    return (total, datum) => {
        if (filter(datum)) {
            return total + datum.total_value;
        }
        else {
            return total;
        }
    };
}
function calculateRevenue(data) {
    return data.reduce(accumulateFiltering((datum) => datum.account_category === 'revenue'), 0);
}
exports.calculateRevenue = calculateRevenue;
function calculateExpenses(data) {
    return data.reduce(accumulateFiltering((datum) => datum.account_category === 'expense'), 0);
}
exports.calculateExpenses = calculateExpenses;
// eslint-disable-next-line prettier/prettier
function calculateGrossProfitMargin(data, revenue) {
    if (!revenue)
        revenue = calculateRevenue(data);
    const total = data.reduce(accumulateFiltering((datum) => {
        return datum.account_type === 'sales' && datum.value_type === 'debit';
    }), 0);
    return total / revenue;
}
exports.calculateGrossProfitMargin = calculateGrossProfitMargin;
// eslint-disable-next-line prettier/prettier
function calculateNetProfitMargin(data, revenue, expenses) {
    if (!revenue)
        revenue = calculateRevenue(data);
    if (!expenses)
        expenses = calculateExpenses(data);
    return (revenue - expenses) / revenue;
}
exports.calculateNetProfitMargin = calculateNetProfitMargin;
function calculateWorkingCapitalRatio(data) {
    const aDebits = data.reduce(accumulateFiltering((datum) => {
        return (datum.account_category === 'assets' &&
            datum.value_type === 'debit' &&
            (datum.account_type === 'current' ||
                datum.account_type === 'bank' ||
                datum.account_type === 'current_accounts_receivable'));
    }), 0);
    const aCredits = data.reduce(accumulateFiltering((datum) => {
        return (datum.account_category === 'assets' &&
            datum.value_type === 'credit' &&
            (datum.account_type === 'current' ||
                datum.account_type === 'bank' ||
                datum.account_type === 'current_accounts_receivable'));
    }), 0);
    const assets = aDebits - aCredits;
    const lDebits = data.reduce(accumulateFiltering((datum) => {
        return (datum.account_category === 'liability' &&
            datum.value_type === 'credit' &&
            (datum.account_type === 'current' ||
                datum.account_type === 'current_accounts_payable'));
    }), 0);
    const lCredits = data.reduce(accumulateFiltering((datum) => {
        return (datum.account_category === 'liability' &&
            datum.value_type === 'debit' &&
            (datum.account_type === 'current' ||
                datum.account_type === 'current_accounts_payable'));
    }), 0);
    const liablities = lDebits - lCredits;
    return assets / liablities;
}
exports.calculateWorkingCapitalRatio = calculateWorkingCapitalRatio;
function print() {
    const formatMoney = (sum) => {
        const string = sum.toLocaleString();
        const index = string.indexOf('.');
        if (index > -1) {
            return string.slice(0, string.indexOf('.'));
        }
        else {
            return string;
        }
    };
    const formatPercentage = (perc) => {
        return (perc * 100).toFixed(1);
    };
    console.log(`Revenue: $${formatMoney(calculateRevenue(data_json_1.default.data))}`);
    console.log(`Expenses: $${formatMoney(calculateExpenses(data_json_1.default.data))}`);
    console.log(`Gross Profit Margin: ${formatPercentage(calculateGrossProfitMargin(data_json_1.default.data))}%`);
    console.log(`Net Profit Margin: ${formatPercentage(calculateNetProfitMargin(data_json_1.default.data))}%`);
    console.log(`Working Capital Ratio: ${formatPercentage(calculateWorkingCapitalRatio(data_json_1.default.data))}%`);
}
exports.print = print;
print();
