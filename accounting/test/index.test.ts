import assert from 'assert'
import chai from 'chai'
import {
  calculateRevenue,
  calculateExpenses,
  calculateGrossProfitMargin,
  calculateNetProfitMargin,
  calculateWorkingCapitalRatio,
} from '../src/index'
import data from '../src/data.json'

describe('Calculate revenue', () => {
  it('should return the correct revenue', () => {
    const revenue = calculateRevenue(data.data)
    const expected = 72431.0
    assert.strictEqual(revenue, expected)
  })
})

describe('Calculate expenses', () => {
  it('should return the correct expenses', () => {
    const expenses = calculateExpenses(data.data)
    const expected = 36_529.68
    assert.strictEqual(expenses, expected)
  })
})

describe('Calculate Gross Profit Margin', () => {
  it('should return the correct gross profit margin', () => {
    const revenue = calculateRevenue(data.data)
    const margin = calculateGrossProfitMargin(data.data, revenue)
    const expected = 0.55
    chai.assert.approximately(margin, expected, 0.01)
  })
})

describe('Calculate Net Profit Margin', () => {
  it('should return the correct net profit margin', () => {
    const margin = calculateNetProfitMargin(data.data, 1000, 100)
    const expected = 0.9
    assert.strictEqual(margin, expected)
  })
})

describe('Calculate Working Capital Ratio', () => {
  it('should return the correct working capital ratio', () => {
    const margin = calculateWorkingCapitalRatio(data.data)
    const expected = 1.19
    chai.assert.approximately(margin, expected, 0.01)
  })
})
