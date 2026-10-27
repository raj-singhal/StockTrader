// PortfolioScreen - Holdings and trade history
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { SAMPLE_STOCKS } from '../data/stockData';

interface Props {
  navigation: any;
}

const PortfolioScreen: React.FC<Props> = ({ navigation }) => {
  const holdings = usePortfolioStore((s) => s.holdings);
  const cashBalance = usePortfolioStore((s) => s.cashBalance);
  const tradeHistory = usePortfolioStore((s) => s.tradeHistory);
  const getTotalValue = usePortfolioStore((s) => s.getTotalValue);
  const getTotalPnL = usePortfolioStore((s) => s.getTotalPnL);

  const investedValue = getTotalValue();
  const totalValue = investedValue + cashBalance;
  const pnl = getTotalPnL();

  const formatCurrency = (val: number) =>
    val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Portfolio</Text>
        </View>

        {/* Summary Bar */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Portfolio Value</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalValue)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Cash Available</Text>
            <Text style={[styles.summaryValue, { color: Colors.accent }]}>
              {formatCurrency(cashBalance)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total P&L</Text>
            <Text style={[styles.summaryValue, { color: pnl >= 0 ? Colors.green : Colors.red }]}>
              {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
            </Text>
          </View>
        </View>

        {/* Holdings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Holdings ({holdings.length})</Text>
          {holdings.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="briefcase-outline" size={36} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No Holdings Yet</Text>
              <Text style={styles.emptySubtitle}>Buy stocks from the Markets tab</Text>
              <TouchableOpacity
                style={styles.ctaBtn}
                onPress={() => navigation.navigate('Markets')}
              >
                <Text style={styles.ctaBtnText}>Browse Markets</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.listCard}>
              {holdings.map((holding) => {
                const pnlAmount = (holding.currentPrice - holding.avgPrice) * holding.shares;
                const pnlPct = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
                const isPos = pnlAmount >= 0;
                const totalVal = holding.currentPrice * holding.shares;

                return (
                  <TouchableOpacity
                    key={holding.stockId}
                    style={styles.holdingRow}
                    onPress={() => {
                      const stock = SAMPLE_STOCKS.find((s) => s.id === holding.stockId);
                      if (stock) navigation.navigate('Trade', { stock });
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.holdingLeft}>
                      <View style={styles.symbolBadge}>
                        <Text style={styles.symbolText}>{holding.symbol.charAt(0)}</Text>
                      </View>
                      <View>
                        <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
                        <Text style={styles.holdingShares}>{holding.shares} shares @ {formatCurrency(holding.avgPrice)}</Text>
                      </View>
                    </View>
                    <View style={styles.holdingRight}>
                      <Text style={styles.holdingValue}>{formatCurrency(totalVal)}</Text>
                      <Text style={[styles.holdingPnl, { color: isPos ? Colors.green : Colors.red }]}>
                        {isPos ? '+' : ''}{formatCurrency(pnlAmount)} ({isPos ? '+' : ''}{pnlPct.toFixed(2)}%)
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Trade History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Trades</Text>
          {tradeHistory.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="time-outline" size={36} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No Trades Yet</Text>
              <Text style={styles.emptySubtitle}>Your trade history will appear here</Text>
            </View>
          ) : (
            <View style={styles.listCard}>
              {tradeHistory.slice(0, 10).map((trade) => (
                <View key={trade.id} style={styles.tradeRow}>
                  <View
                    style={[
                      styles.tradeBadge,
                      { backgroundColor: trade.type === 'BUY' ? Colors.greenDim : Colors.redDim },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tradeType,
                        { color: trade.type === 'BUY' ? Colors.green : Colors.red },
                      ]}
                    >
                      {trade.type}
                    </Text>
                  </View>
                  <View style={styles.tradeInfo}>
                    <Text style={styles.tradeSymbol}>{trade.symbol}</Text>
                    <Text style={styles.tradeDetails}>
                      {trade.shares} shares @ {formatCurrency(trade.price)}
                    </Text>
                    <Text style={styles.tradeDate}>{formatDate(trade.timestamp)}</Text>
                  </View>
                  <Text
                    style={[
                      styles.tradeTotal,
                      { color: trade.type === 'BUY' ? Colors.red : Colors.green },
                    ]}
                  >
                    {trade.type === 'BUY' ? '-' : '+'}{formatCurrency(trade.total)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 20,
    overflow: 'hidden',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  summaryLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginBottom: 4,
  },
  summaryValue: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  listCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  emptyCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  ctaBtn: {
    marginTop: 16,
    backgroundColor: Colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  ctaBtnText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '700',
  },
  holdingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  holdingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  holdingSymbol: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  holdingShares: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  holdingRight: {
    alignItems: 'flex-end',
  },
  holdingValue: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  holdingPnl: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: '600',
  },
  tradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    gap: 12,
  },
  tradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 44,
    alignItems: 'center',
  },
  tradeType: {
    fontSize: 12,
    fontWeight: '700',
  },
  tradeInfo: {
    flex: 1,
  },
  tradeSymbol: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  tradeDetails: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  tradeDate: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  tradeTotal: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default PortfolioScreen;
