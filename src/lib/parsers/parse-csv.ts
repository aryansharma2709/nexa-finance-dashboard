import Papa from 'papaparse'
import type { ParseResult } from 'papaparse'

export function parseCsv<T>(file: File): Promise<ParseResult<T>> {
  return new Promise((resolve, reject) => {
    Papa.parse<T>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => resolve(results),
      error: (error) => reject(error),
    })
  })
}
