// TradeScreen - Buy/Sell stock modal with order summary
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { Stock } from '../data/stockData';
import { usePortfolioStore } from '../store/usePortfolioStore';
import SparklineChart from '../components/SparklineChart';

// Param list for the stack navigators that contain TradeScreen
type TradeStackParamList = {
  Trade: { stock: Stock };
  [key: string]: object | undefined;
};

type Props = NativeStackScreenProps<TradeStackParamList, 'Trade'>;

type TradeMode = 'BUY' | 'SELL';

const TradeScreen: React.FC<Props> = ({ route, navigation }) => {
  const { stock } = route.params;
  const [mode, setMode] = useState<TradeMode>('BUY');
  const [sharesInput, setSharesInput] = useState('1');

  const cashBalance = usePortfolioStore((s) => s.cashBalance);
  const buyStock = usePortfolioStore((s) => s.buyStock);
  const sellStock = usePortfolioStore((s) => s.sellStock);
  const toggleWatchlist = usePortfolioStore((s) => s.toggleWatchlist);
  const watchlistIds = usePortfolioStore((s) => s.watchlistIds);
  const getHoldingBySymbol = usePortfolioStore((s) => s.getHoldingBySymbol);

  const holding = getHoldingBySymbol(stock.symbol);
  const isWatchlisted = watchlistIds.includes(stock.id);
  const shares = parseInt(sharesInput, 10) || 0;
  const orderTotal = shares * stock.price;
  const isPositive = stock.changePercent >= 0;

  const formatCurrency = (val: number) =>
    val.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

  const handleTrade = () => {
    if (shares <= 0) {
      Alert.alert('Invalid Order', 'Please enter a valid number of shares.');
      return;
    }

    const result =
      mode === 'BUY' ? buyStock(stock, shares) : sellStock(stock, shares);

    if (result.success) {
      Alert.alert(
        mode === 'BUY' ? '✅ Order Executed' : '✅ Sold Successfully',
        result.message,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('❌ Order Failed', result.message);
    }
  };

  const canAfford = orderTotal <= cashBalance;
  const hasEnoughShares = mode === 'SELL' ? shares <= (holding?.shares ?? 0) : true;
  const isOrderValid = shares > 0 && (mode === 'BUY' ? canAfford : hasEnoughShares);

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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerSymbol}>{stock.symbol}</Text>
            <Text style={styles.headerName}>{stock.name}</Text>
          </View>
          <TouchableOpacity
            style={[styles.watchlistBtn, isWatchlisted && styles.watchlistBtnActive]}
            onPress={() => toggleWatchlist(stock.id)}
          >
            <Ionicons
              name={isWatchlisted ? 'star' : 'star-outline'}
              size={20}
              color={isWatchlisted ? '#FFD700' : Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={styles.currentPrice}>{formatCurrency(stock.price)}</Text>
          <View style={[styles.changeBadge, { backgroundColor: isPositive ? Colors.greenDim : Colors.redDim }]}>
            <Text style={[styles.changeText, { color: isPositive ? Colors.green : Colors.red }]}>
              {isPositive ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </Text>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <SparklineChart
            data={stock.priceHistory}
            color={isPositive ? Colors.green : Colors.red}
            width={340}
            height={80}
          />
        </View>

        {/* Stock Info Cards */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Volume</Text>
            <Text style={styles.infoValue}>{stock.volume}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Market Cap</Text>
            <Text style={styles.infoValue}>{stock.marketCap}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Sector</Text>
            <Text style={styles.infoValue}>{stock.sector}</Text>
          </View>
          {holding && (
            <View style={[styles.infoCard, styles.infoCardOwned]}>
              <Text style={styles.infoLabel}>Your Shares</Text>
              <Text style={[styles.infoValue, { color: Colors.accent }]}>{holding.shares}</Text>
            </View>
          )}
        </View>

        {/* Trade Panel */}
        <View style={styles.tradePanel}>
          {/* BUY / SELL Toggle */}
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'BUY' && styles.modeBtnActive, mode === 'BUY' && styles.buyActive]}
              onPress={() => setMode('BUY')}
            >
              <Text style={[styles.modeBtnText, mode === 'BUY' && styles.modeBtnTextActive]}>BUY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'SELL' && styles.modeBtnActive, mode === 'SELL' && styles.sellActive]}
              onPress={() => setMode('SELL')}
            >
              <Text style={[styles.modeBtnText, mode === 'SELL' && styles.modeBtnTextActive]}>SELL</Text>
            </TouchableOpacity>
          </View>

          {/* Shares Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Number of Shares</Text>
            <View style={styles.inputRow}>
              <TouchableOpacity
                style={styles.inputControl}
                onPress={() => setSharesInput(String(Math.max(1, shares - 1)))}
              >
                <Ionicons name="remove" size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
              <TextInput
                style={styles.sharesInput}
                value={sharesInput}
                onChangeText={(v) => setSharesInput(v.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                textAlign="center"
              />
              <TouchableOpacity
                style={styles.inputControl}
                onPress={() => setSharesInput(String(shares + 1))}
              >
                <Ionicons name="add" size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Order Summary */}
          <View style={styles.orderSummary}>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Price per share</Text>
              <Text style={styles.orderValue}>{formatCurrency(stock.price)}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Shares</Text>
              <Text style={styles.orderValue}>{shares}</Text>
            </View>
            <View style={[styles.orderRow, styles.orderRowTotal]}>
              <Text style={styles.orderLabelBold}>Estimated Total</Text>
              <Text style={[styles.orderValueBold, { color: mode === 'BUY' ? Colors.red : Colors.green }]}>
                {mode === 'BUY' ? '-' : '+'}{formatCurrency(orderTotal)}
              </Text>
            </View>
          </View>

          {/* Balance info */}
          <View style={styles.balanceInfo}>
            {mode === 'BUY' ? (
              <>
                <Text style={styles.balanceLabel}>
                  Cash Available: <Text style={[styles.balanceValue, !canAfford && styles.balanceInsufficient]}>
                    {formatCurrency(cashBalance)}
                  </Text>
                </Text>
                {!canAfford && shares > 0 && (
                  <Text style={styles.warningText}>⚠️ Insufficient funds</Text>
                )}
              </>
            ) : (
              <>
                <Text style={styles.balanceLabel}>
                  Shares Owned: <Text style={styles.balanceValue}>{holding?.shares ?? 0}</Text>
                </Text>
                {!hasEnoughShares && shares > 0 && (
                  <Text style={styles.warningText}>⚠️ You don't own that many shares</Text>
                )}
              </>
            )}
          </View>

          {/* Execute Button */}
          <TouchableOpacity
            style={[
              styles.executeBtn,
              mode === 'BUY' ? styles.executeBuyBtn : styles.executeSellBtn,
              !isOrderValid && styles.executeBtnDisabled,
            ]}
            onPress={handleTrade}
            disabled={!isOrderValid}
          >
            <Text style={styles.executeBtnText}>
              {mode === 'BUY' ? `Buy ${shares} Share${shares !== 1 ? 's' : ''}` : `Sell ${shares} Share${shares !== 1 ? 's' : ''}`}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Simulated trading only. Not real financial advice.
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerSymbol: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  headerName: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  watchlistBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchlistBtnActive: {
    backgroundColor: 'rgba(255,215,0,0.15)',
  },
  priceSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  currentPrice: {
    color: Colors.textPrimary,
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1,
  },
  changeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 8,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    flex: 1,
    minWidth: '30%',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  infoCardOwned: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentDim,
  },
  infoLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  infoValue: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  tradePanel: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  modeBtnActive: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  buyActive: {
    backgroundColor: Colors.greenDim,
  },
  sellActive: {
    backgroundColor: Colors.redDim,
  },
  modeBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  modeBtnTextActive: {
    color: Colors.textPrimary,
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputControl: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  sharesInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  orderSummary: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    gap: 8,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderRowTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingTop: 8,
    marginTop: 4,
  },
  orderLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  orderValue: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  orderLabelBold: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  orderValueBold: {
    fontSize: 16,
    fontWeight: '800',
  },
  balanceInfo: {
    marginBottom: 16,
    alignItems: 'center',
  },
  balanceLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  balanceValue: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  balanceInsufficient: {
    color: Colors.red,
  },
  warningText: {
    color: Colors.red,
    fontSize: 12,
    marginTop: 4,
  },
  executeBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  executeBuyBtn: {
    backgroundColor: Colors.green,
  },
  executeSellBtn: {
    backgroundColor: Colors.red,
  },
  executeBtnDisabled: {
    opacity: 0.4,
  },
  executeBtnText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  disclaimer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  disclaimerText: {
    color: Colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
});

export default TradeScreen;
