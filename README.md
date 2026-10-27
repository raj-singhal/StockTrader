# 📈 StockTrader — React Native Trading Simulator

A professional **Stock Trading Simulator** built with **React Native + Expo + TypeScript** for portfolio demonstration purposes.

> ⚠️ This is a **simulated trading app** using sample data. No real money or financial data is involved.

---

## ✨ Features

- **📊 Home Dashboard** — Portfolio value, P&L, market summary (gainers/losers), and customizable watchlist
- **📉 Markets Screen** — Browse 10 stocks with search and sort (gainers/losers)
- **💼 Portfolio Screen** — Holdings with individual P&L, trade history log
- **🛒 Trade Screen** — Buy/sell with quantity input, order summary, balance validation
- **⭐ Watchlist** — Add/remove stocks from your personal watchlist
- **📡 Live Simulation** — Prices auto-update every 5 seconds to simulate market movement
- **🌙 Dark Theme** — Professional dark UI with color-coded indicators

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Expo | ~58.x | Managed React Native workflow |
| TypeScript | ~6.x | Type safety |
| React Navigation | ^6.x | Bottom tabs + native stack |
| Zustand | ^4.x | Portfolio state management |
| react-native-svg | ^15.x | Sparkline price charts |
| @expo/vector-icons | ^14.x | Ionicons |

---

## 📁 Project Structure

```
StockTrader/
├── App.tsx                              # Entry point
├── babel.config.js                      # Reanimated plugin
├── src/
│   ├── theme/
│   │   └── colors.ts                    # Dark theme palette
│   ├── data/
│   │   └── stockData.ts                 # 10 sample stocks with price history
│   ├── store/
│   │   └── usePortfolioStore.ts         # Zustand store (buy/sell/watchlist)
│   ├── components/
│   │   ├── PortfolioCard.tsx            # Balance + P&L card
│   │   ├── StockListItem.tsx            # Stock row with sparkline
│   │   └── SparklineChart.tsx           # SVG price chart
│   ├── screens/
│   │   ├── HomeScreen.tsx               # Dashboard
│   │   ├── MarketsScreen.tsx            # Stock browser
│   │   ├── PortfolioScreen.tsx          # Holdings + trade history
│   │   └── TradeScreen.tsx              # Buy/Sell screen
│   └── navigation/
│       └── AppNavigator.tsx             # Tab + Stack navigator
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo Go app on your phone (or Android/iOS emulator)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/StockTrader.git
cd StockTrader

# Install dependencies
npm install

# Start the development server
npm start
```

Then scan the QR code with **Expo Go** on your phone.

### Run on specific platforms

```bash
npm run android     # Android emulator
npm run ios         # iOS simulator (macOS only)
npm run web         # Web browser
```

---

## 📱 Screenshots

| Home | Markets | Trade |
|------|---------|-------|
| Portfolio balance + watchlist | Browse & search stocks | Buy/Sell with order summary |

---

## 💡 Simulated Trading Rules

- Start with **\$100,000** virtual cash
- Buy any stock at the current sample price
- Sell shares you own at the current price
- Portfolio P&L tracks avg purchase price vs current price
- Prices fluctuate ±1% every 5 seconds

---

## 🧰 Architecture Decisions

- **Zustand** over Redux — lightweight, no boilerplate, perfect for small-medium apps
- **Native Stack** — smooth transitions on both platforms
- **SVG Sparklines** — custom `react-native-svg` charts without heavy chart libraries
- **Strict TypeScript** — all components and store are fully typed

---

## 📝 License

MIT — feel free to use this for your own projects or portfolio.

---

*Built with ❤️ using React Native + Expo*
