import Data from './data.json'

interface Datum {
  account_category: string
  account_type: string
  total_value: number
  value_type: string
}

function accumulateFiltering(filter: (datum: Datum) => boolean) {
  return (total: number, datum: Datum) => {
    if (filter(datum)) {
      return total + datum.total_value
    } else {
      return total
    }
  }
}

export function calculateRevenue(data: Datum[]): number {
  return data.reduce(
    accumulateFiltering((datum) => datum.account_category === 'revenue'),
    0,
  )
}

export function calculateExpenses(data: Datum[]): number {
  return data.reduce(
    accumulateFiltering((datum) => datum.account_category === 'expense'),
    0,
  )
}

export function calculateGrossProfitMargin(data: Datum[], revenue: number): number {
  const total = data.reduce(
    accumulateFiltering((datum) => {
      return datum.account_type === 'sales' && datum.value_type === 'debit'
    }),
    0,
  )
  return total / revenue
}
