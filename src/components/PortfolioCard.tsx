// PortfolioCard - Shows total portfolio value, P&L, and cash balance
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../theme/colors';
import { usePortfolioStore } from '../store/usePortfolioStore';

const PortfolioCard: React.FC = () => {
  const cashBalance = usePortfolioStore((s) => s.cashBalance);
  const getTotalValue = usePortfolioStore((s) => s.getTotalValue);
  const getTotalPnL = usePortfolioStore((s) => s.getTotalPnL);
  const getTotalPnLPercent = usePortfolioStore((s) => s.getTotalPnLPercent);

  const investedValue = getTotalValue();
  const totalValue = investedValue + cashBalance;
  const pnl = getTotalPnL();
  const pnlPercent = getTotalPnLPercent();
  const isPositive = pnl >= 0;

  const formatCurrency = (val: number) =>
    val.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

  return (
    <View style={styles.card}>
      {/* Header */}
      <Text style={styles.label}>Total Portfolio Value</Text>
      <Text style={styles.totalValue}>{formatCurrency(totalValue)}</Text>

      {/* P&L Row */}
      <View style={[styles.pnlBadge, isPositive ? styles.pnlGreen : styles.pnlRed]}>
        <Text style={[styles.pnlText, { color: isPositive ? Colors.green : Colors.red }]}>
          {isPositive ? '▲' : '▼'} {formatCurrency(Math.abs(pnl))} ({isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%)
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Invested</Text>
          <Text style={styles.statValue}>{formatCurrency(investedValue)}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Cash</Text>
          <Text style={styles.statValue}>{formatCurrency(cashBalance)}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Day P&L</Text>
          <Text style={[styles.statValue, isPositive ? styles.greenText : styles.redText]}>
            {isPositive ? '+' : ''}{formatCurrency(pnl)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.accent,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  totalValue: {
    color: Colors.textPrimary,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  pnlBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 16,
  },
  pnlGreen: {
    backgroundColor: Colors.greenDim,
  },
  pnlRed: {
    backgroundColor: Colors.redDim,
  },
  pnlText: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.cardBorder,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  greenText: {
    color: Colors.green,
  },
  redText: {
    color: Colors.red,
  },
});

export default PortfolioCard;
