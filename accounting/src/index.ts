import Data from './data.json'

interface Datum {
  account_category: string
  total_value: number
}

function accumulateCategory(category: string) {
  return (total: number, datum: Datum) => {
    if (datum.account_category === category) {
      return total + datum.total_value
    } else {
      return total
    }
  }
}

export function calculateRevenue(data: Datum[]): number {
  return data.reduce(accumulateCategory('revenue'), 0)
}

export function calculateExpenses(data: Datum[]): number {
  return data.reduce(accumulateCategory('expense'), 0)
}
