import data from './data.json'

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

// eslint-disable-next-line prettier/prettier
export function calculateGrossProfitMargin(data: Datum[], revenue?: number ): number {
  if (!revenue) revenue = calculateRevenue(data)

  const total = data.reduce(
    accumulateFiltering((datum) => {
      return datum.account_type === 'sales' && datum.value_type === 'debit'
    }),
    0,
  )
  return total / revenue
}

// eslint-disable-next-line prettier/prettier
export function calculateNetProfitMargin(data: Datum[], revenue?: number, expenses?: number,): number {
  if (!revenue) revenue = calculateRevenue(data)
  if (!expenses) expenses = calculateExpenses(data)

  return (revenue - expenses) / revenue
}

export function calculateWorkingCapitalRatio(data: Datum[]): number {
  const aDebits = data.reduce(
    accumulateFiltering((datum) => {
      return (
        datum.account_category === 'assets' &&
        datum.value_type === 'debit' &&
        (datum.account_type === 'current' ||
          datum.account_type === 'bank' ||
          datum.account_type === 'current_accounts_receivable')
      )
    }),
    0,
  )

  const aCredits = data.reduce(
    accumulateFiltering((datum) => {
      return (
        datum.account_category === 'assets' &&
        datum.value_type === 'credit' &&
        (datum.account_type === 'current' ||
          datum.account_type === 'bank' ||
          datum.account_type === 'current_accounts_receivable')
      )
    }),
    0,
  )

  const assets = aDebits - aCredits

  const lDebits = data.reduce(
    accumulateFiltering((datum) => {
      return (
        datum.account_category === 'liability' &&
        datum.value_type === 'credit' &&
        (datum.account_type === 'current' ||
          datum.account_type === 'current_accounts_payable')
      )
    }),
    0,
  )

  const lCredits = data.reduce(
    accumulateFiltering((datum) => {
      return (
        datum.account_category === 'liability' &&
        datum.value_type === 'debit' &&
        (datum.account_type === 'current' ||
          datum.account_type === 'current_accounts_payable')
      )
    }),
    0,
  )

  const liablities = lDebits - lCredits

  return assets / liablities
}

export function print() {
  const formatMoney = (sum: number) => {
    const string = sum.toLocaleString()
    const index = string.indexOf('.')
    if (index > -1) {
      return string.slice(0, string.indexOf('.'))
    } else {
      return string
    }
  }

  const formatPercentage = (perc: number) => {
    return (perc * 100).toFixed(1)
  }

  console.log(`Revenue: $${formatMoney(calculateRevenue(data.data))}`)
  console.log(`Expenses: $${formatMoney(calculateExpenses(data.data))}`)
  console.log(
    `Gross Profit Margin: ${formatPercentage(
      calculateGrossProfitMargin(data.data),
    )}%`,
  )
  console.log(
    `Net Profit Margin: ${formatPercentage(
      calculateNetProfitMargin(data.data),
    )}%`,
  )
  console.log(
    `Working Capital Ratio: ${formatPercentage(
      calculateWorkingCapitalRatio(data.data),
    )}%`,
  )
}

print()
