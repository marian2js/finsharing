export const roundDecimals = (number: number, decimals: number) =>
  Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)
