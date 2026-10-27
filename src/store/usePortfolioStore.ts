// Zustand store for portfolio state management
import { create } from 'zustand';
import { Stock } from '../data/stockData';

export interface Holding {
  stockId: string;
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

export interface TradeRecord {
  id: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  shares: number;
  price: number;
  total: number;
  timestamp: Date;
}

interface PortfolioState {
  // Portfolio
  cashBalance: number;
  holdings: Holding[];
  tradeHistory: TradeRecord[];
  watchlistIds: string[];

  // Computed
  getTotalInvested: () => number;
  getTotalValue: () => number;
  getTotalPnL: () => number;
  getTotalPnLPercent: () => number;
  getHoldingBySymbol: (symbol: string) => Holding | undefined;

  // Actions
  buyStock: (stock: Stock, shares: number) => { success: boolean; message: string };
  sellStock: (stock: Stock, shares: number) => { success: boolean; message: string };
  toggleWatchlist: (stockId: string) => void;
  updatePrices: () => void;
}

// Simulate price fluctuations
const simulatePriceChange = (price: number): number => {
  const changePercent = (Math.random() - 0.48) * 0.02; // -1% to +1%
  return parseFloat((price * (1 + changePercent)).toFixed(2));
};

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  cashBalance: 100000, // Start with $100,000
  holdings: [
    // Pre-loaded demo holdings
    {
      stockId: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 10,
      avgPrice: 175.0,
      currentPrice: 189.45,
    },
    {
      stockId: '5',
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      shares: 5,
      avgPrice: 820.0,
      currentPrice: 875.43,
    },
  ],
  tradeHistory: [],
  watchlistIds: ['1', '3', '5', '7', '2'],

  getTotalInvested: () => {
    return get().holdings.reduce(
      (sum, h) => sum + h.avgPrice * h.shares,
      0
    );
  },

  getTotalValue: () => {
    return get().holdings.reduce(
      (sum, h) => sum + h.currentPrice * h.shares,
      0
    );
  },

  getTotalPnL: () => {
    const totalValue = get().getTotalValue();
    const totalInvested = get().getTotalInvested();
    return totalValue - totalInvested;
  },

  getTotalPnLPercent: () => {
    const totalInvested = get().getTotalInvested();
    if (totalInvested === 0) return 0;
    return (get().getTotalPnL() / totalInvested) * 100;
  },

  getHoldingBySymbol: (symbol: string) => {
    return get().holdings.find((h) => h.symbol === symbol);
  },

  buyStock: (stock: Stock, shares: number) => {
    const cost = stock.price * shares;
    const { cashBalance, holdings } = get();

    if (cost > cashBalance) {
      return { success: false, message: 'Insufficient funds' };
    }
    if (shares <= 0) {
      return { success: false, message: 'Invalid share quantity' };
    }

    const existingHolding = holdings.find((h) => h.symbol === stock.symbol);
    let updatedHoldings: Holding[];

    if (existingHolding) {
      // Update average price
      const totalShares = existingHolding.shares + shares;
      const newAvgPrice =
        (existingHolding.avgPrice * existingHolding.shares + stock.price * shares) / totalShares;
      updatedHoldings = holdings.map((h) =>
        h.symbol === stock.symbol
          ? { ...h, shares: totalShares, avgPrice: parseFloat(newAvgPrice.toFixed(2)), currentPrice: stock.price }
          : h
      );
    } else {
      updatedHoldings = [
        ...holdings,
        {
          stockId: stock.id,
          symbol: stock.symbol,
          name: stock.name,
          shares,
          avgPrice: stock.price,
          currentPrice: stock.price,
        },
      ];
    }

    const trade: TradeRecord = {
      id: Date.now().toString(),
      type: 'BUY',
      symbol: stock.symbol,
      shares,
      price: stock.price,
      total: cost,
      timestamp: new Date(),
    };

    set({
      cashBalance: parseFloat((cashBalance - cost).toFixed(2)),
      holdings: updatedHoldings,
      tradeHistory: [trade, ...get().tradeHistory],
    });

    return { success: true, message: `Bought ${shares} shares of ${stock.symbol}` };
  },

  sellStock: (stock: Stock, shares: number) => {
    const { cashBalance, holdings } = get();
    const holding = holdings.find((h) => h.symbol === stock.symbol);

    if (!holding) {
      return { success: false, message: 'You do not own this stock' };
    }
    if (shares > holding.shares) {
      return { success: false, message: `You only own ${holding.shares} shares` };
    }
    if (shares <= 0) {
      return { success: false, message: 'Invalid share quantity' };
    }

    const proceeds = stock.price * shares;
    let updatedHoldings: Holding[];

    if (shares === holding.shares) {
      updatedHoldings = holdings.filter((h) => h.symbol !== stock.symbol);
    } else {
      updatedHoldings = holdings.map((h) =>
        h.symbol === stock.symbol ? { ...h, shares: h.shares - shares } : h
      );
    }

    const trade: TradeRecord = {
      id: Date.now().toString(),
      type: 'SELL',
      symbol: stock.symbol,
      shares,
      price: stock.price,
      total: proceeds,
      timestamp: new Date(),
    };

    set({
      cashBalance: parseFloat((cashBalance + proceeds).toFixed(2)),
      holdings: updatedHoldings,
      tradeHistory: [trade, ...get().tradeHistory],
    });

    return { success: true, message: `Sold ${shares} shares of ${stock.symbol}` };
  },

  toggleWatchlist: (stockId: string) => {
    const { watchlistIds } = get();
    if (watchlistIds.includes(stockId)) {
      set({ watchlistIds: watchlistIds.filter((id) => id !== stockId) });
    } else {
      set({ watchlistIds: [...watchlistIds, stockId] });
    }
  },

  updatePrices: () => {
    // Simulate live price updates
    set((state) => ({
      holdings: state.holdings.map((h) => ({
        ...h,
        currentPrice: simulatePriceChange(h.currentPrice),
      })),
    }));
  },
}));
