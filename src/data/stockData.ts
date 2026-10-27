// Sample stock data with simulated price history

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;      // absolute price change
  changePercent: number;
  volume: string;
  marketCap: string;
  sector: string;
  priceHistory: number[]; // last 7 data points for sparkline
}

export const SAMPLE_STOCKS: Stock[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 189.45,
    change: 3.21,
    changePercent: 1.72,
    volume: '58.3M',
    marketCap: '$2.94T',
    sector: 'Technology',
    priceHistory: [172, 175, 178, 180, 182, 186, 189.45],
  },
  {
    id: '2',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 415.32,
    change: -2.18,
    changePercent: -0.52,
    volume: '22.1M',
    marketCap: '$3.08T',
    sector: 'Technology',
    priceHistory: [420, 418, 416, 419, 417, 418, 415.32],
  },
  {
    id: '3',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 178.92,
    change: 4.56,
    changePercent: 2.62,
    volume: '25.4M',
    marketCap: '$2.21T',
    sector: 'Technology',
    priceHistory: [165, 168, 170, 172, 175, 174, 178.92],
  },
  {
    id: '4',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 198.67,
    change: -1.33,
    changePercent: -0.66,
    volume: '35.7M',
    marketCap: '$2.09T',
    sector: 'Consumer Disc.',
    priceHistory: [205, 202, 200, 198, 199, 200, 198.67],
  },
  {
    id: '5',
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 875.43,
    change: 22.18,
    changePercent: 2.60,
    volume: '41.2M',
    marketCap: '$2.16T',
    sector: 'Technology',
    priceHistory: [820, 835, 845, 855, 860, 853, 875.43],
  },
  {
    id: '6',
    symbol: 'META',
    name: 'Meta Platforms',
    price: 523.14,
    change: -8.42,
    changePercent: -1.59,
    volume: '18.9M',
    marketCap: '$1.33T',
    sector: 'Technology',
    priceHistory: [540, 535, 530, 528, 525, 531, 523.14],
  },
  {
    id: '7',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 242.31,
    change: 11.55,
    changePercent: 5.01,
    volume: '89.6M',
    marketCap: '$772B',
    sector: 'Automotive',
    priceHistory: [210, 218, 225, 228, 232, 230, 242.31],
  },
  {
    id: '8',
    symbol: 'BRK.B',
    name: 'Berkshire Hathaway',
    price: 391.08,
    change: 0.87,
    changePercent: 0.22,
    volume: '3.2M',
    marketCap: '$855B',
    sector: 'Financials',
    priceHistory: [388, 389, 390, 390, 391, 391, 391.08],
  },
  {
    id: '9',
    symbol: 'JPM',
    name: 'JPMorgan Chase',
    price: 212.75,
    change: -3.25,
    changePercent: -1.50,
    volume: '12.8M',
    marketCap: '$612B',
    sector: 'Financials',
    priceHistory: [220, 218, 216, 215, 214, 216, 212.75],
  },
  {
    id: '10',
    symbol: 'V',
    name: 'Visa Inc.',
    price: 285.90,
    change: 1.78,
    changePercent: 0.63,
    volume: '6.4M',
    marketCap: '$587B',
    sector: 'Financials',
    priceHistory: [279, 281, 282, 283, 284, 284, 285.90],
  },
];

export const WATCHLIST_IDS = ['1', '3', '5', '7', '2']; // Default watchlist

export const getStockById = (id: string): Stock | undefined =>
  SAMPLE_STOCKS.find((s) => s.id === id);

export const getStockBySymbol = (symbol: string): Stock | undefined =>
  SAMPLE_STOCKS.find((s) => s.symbol === symbol);
