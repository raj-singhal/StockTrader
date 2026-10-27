// StockListItem - Reusable stock row with price, change, and sparkline
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../theme/colors';
import { Stock } from '../data/stockData';
import SparklineChart from './SparklineChart';

interface StockListItemProps {
  stock: Stock;
  onPress?: (stock: Stock) => void;
  showSector?: boolean;
}

const StockListItem: React.FC<StockListItemProps> = ({ stock, onPress, showSector = false }) => {
  const isPositive = stock.changePercent >= 0;
  const changeColor = isPositive ? Colors.green : Colors.red;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(stock)}
      activeOpacity={0.7}
    >
      {/* Left: Symbol + Name */}
      <View style={styles.left}>
        <View style={styles.symbolBadge}>
          <Text style={styles.symbolText}>{stock.symbol.charAt(0)}</Text>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.symbol}>{stock.symbol}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {showSector ? stock.sector : stock.name}
          </Text>
        </View>
      </View>

      {/* Center: Sparkline */}
      <View style={styles.chartContainer}>
        <SparklineChart
          data={stock.priceHistory}
          color={changeColor}
          width={70}
          height={32}
        />
      </View>

      {/* Right: Price + Change */}
      <View style={styles.right}>
        <Text style={styles.price}>${stock.price.toFixed(2)}</Text>
        <View style={[styles.changeBadge, { backgroundColor: isPositive ? Colors.greenDim : Colors.redDim }]}>
          <Text style={[styles.changeText, { color: changeColor }]}>
            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 110,
  },
  symbolBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  symbolText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  nameContainer: {
    flex: 1,
  },
  symbol: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  name: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  chartContainer: {
    width: 72,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  right: {
    alignItems: 'flex-end',
    minWidth: 90,
  },
  price: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default StockListItem;
