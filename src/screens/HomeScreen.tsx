// HomeScreen - Dashboard with portfolio overview and watchlist
import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import PortfolioCard from '../components/PortfolioCard';
import StockListItem from '../components/StockListItem';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { SAMPLE_STOCKS, Stock } from '../data/stockData';

interface Props {
  navigation: any;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const watchlistIds = usePortfolioStore((s) => s.watchlistIds);
  const updatePrices = usePortfolioStore((s) => s.updatePrices);

  const watchlistStocks = SAMPLE_STOCKS.filter((s) => watchlistIds.includes(s.id));

  // Simulate live updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices();
    }, 5000);
    return () => clearInterval(interval);
  }, [updatePrices]);

  const handleStockPress = useCallback(
    (stock: Stock) => {
      navigation.navigate('Trade', { stock });
    },
    [navigation]
  );

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  // Market summary stats
  const gainers = SAMPLE_STOCKS.filter((s) => s.changePercent > 0).length;
  const losers = SAMPLE_STOCKS.filter((s) => s.changePercent < 0).length;

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
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.headerTitle}>StockTrader</Text>
          </View>
          <TouchableOpacity
            style={styles.notifButton}
            onPress={() => navigation.navigate('Markets')}
          >
            <Ionicons name="bar-chart-outline" size={22} color={Colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Portfolio Card */}
        <PortfolioCard />

        {/* Market Summary */}
        <View style={styles.marketSummary}>
          <View style={styles.summaryCard}>
            <Ionicons name="trending-up" size={16} color={Colors.green} />
            <Text style={styles.summaryValue}>{gainers}</Text>
            <Text style={styles.summaryLabel}>Gainers</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCard}>
            <Ionicons name="trending-down" size={16} color={Colors.red} />
            <Text style={styles.summaryValue}>{losers}</Text>
            <Text style={styles.summaryLabel}>Losers</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCard}>
            <Ionicons name="pulse" size={16} color={Colors.accent} />
            <Text style={styles.summaryValue}>{SAMPLE_STOCKS.length}</Text>
            <Text style={styles.summaryLabel}>Tracked</Text>
          </View>
        </View>

        {/* Watchlist Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Watchlist</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Markets')}
              style={styles.seeAllBtn}
            >
              <Text style={styles.seeAllText}>View Markets</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.accent} />
            </TouchableOpacity>
          </View>

          <View style={styles.listCard}>
            {watchlistStocks.length > 0 ? (
              watchlistStocks.map((stock) => (
                <StockListItem
                  key={stock.id}
                  stock={stock}
                  onPress={handleStockPress}
                />
              ))
            ) : (
              <View style={styles.emptyWatchlist}>
                <Ionicons name="star-outline" size={32} color={Colors.textMuted} />
                <Text style={styles.emptyText}>No stocks in watchlist</Text>
                <Text style={styles.emptySubText}>Browse Markets to add stocks</Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Trade Shortcuts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => navigation.navigate('Markets')}
            >
              <Ionicons name="search" size={20} color={Colors.accent} />
              <Text style={styles.quickBtnText}>Browse Stocks</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => navigation.navigate('Portfolio')}
            >
              <Ionicons name="briefcase-outline" size={20} color={Colors.accent} />
              <Text style={styles.quickBtnText}>My Portfolio</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            📊 Simulated trading only · Prices are for demo purposes
          </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  greeting: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 2,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  notifButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketSummary: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 3,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: 10,
  },
  summaryValue: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  summaryLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  section: {
    marginTop: 22,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '500',
  },
  listCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  emptyWatchlist: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
  },
  emptySubText: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickBtnText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  disclaimer: {
    marginTop: 24,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  disclaimerText: {
    color: Colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
});

export default HomeScreen;
