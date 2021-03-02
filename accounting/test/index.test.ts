import assert from 'assert'
import { calculateRevenue, calculateExpenses } from '../src/index'
import data from '../src/data.json'

describe('Calculate revenue', () => {
  const revenue = calculateRevenue(data.data)
  const expected = 32431.0
  assert.strictEqual(revenue, expected)
})

describe('Calculate expenses', () => {
  const expenses = calculateExpenses(data.data)
  const expected = 36_529.68
  assert.strictEqual(expenses, expected)
})
