/* The largest listed technology companies, used as typographic imagery on the
   home page.

   SYMBOLS ONLY, and on purpose. This is a static site: any price or percentage
   shown here would be frozen at build time and presented as if it were a
   quote, which on a club site that states "nothing here is investment advice"
   is fabricated market data. If live figures are ever wanted they need a real
   data source, a timestamp, and a delay notice — not a constant in this file. */

export type Ticker = {
  symbol: string
  /** Company name. Reference only: the tape is decorative and aria-hidden. */
  name: string
}

export const TICKERS: Ticker[] = [
  { symbol: 'NVDA', name: 'NVIDIA' },
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'GOOGL', name: 'Alphabet' },
  { symbol: 'AMZN', name: 'Amazon' },
  { symbol: 'META', name: 'Meta Platforms' },
  { symbol: 'AVGO', name: 'Broadcom' },
  { symbol: 'TSM', name: 'Taiwan Semiconductor' },
  { symbol: 'TSLA', name: 'Tesla' },
  { symbol: 'ORCL', name: 'Oracle' },
  { symbol: 'NFLX', name: 'Netflix' },
  { symbol: 'AMD', name: 'Advanced Micro Devices' },
]
