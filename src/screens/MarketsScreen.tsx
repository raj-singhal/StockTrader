// MarketsScreen - Browse all stocks with search
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import StockListItem from '../components/StockListItem';
import { SAMPLE_STOCKS, Stock } from '../data/stockData';

interface Props {
  navigation: any;
}

type SortOption = 'default' | 'gainers' | 'losers' | 'volume';

const MarketsScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const filteredStocks = useCallback(() => {
    let stocks = SAMPLE_STOCKS.filter(
      (s) =>
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortBy) {
      case 'gainers':
        stocks = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
        break;
      case 'losers':
        stocks = [...stocks].sort((a, b) => a.changePercent - b.changePercent);
        break;
      default:
        break;
    }
    return stocks;
  }, [searchQuery, sortBy]);

  const handleStockPress = (stock: Stock) => {
    navigation.navigate('Trade', { stock });
  };

  const SortButton = ({ label, value }: { label: string; value: SortOption }) => (
    <TouchableOpacity
      style={[styles.sortBtn, sortBy === value && styles.sortBtnActive]}
      onPress={() => setSortBy(value)}
    >
      <Text style={[styles.sortBtnText, sortBy === value && styles.sortBtnTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Markets</Text>
        <Text style={styles.subtitle}>{SAMPLE_STOCKS.length} stocks tracked</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={16} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search stocks..."
          placeholderTextColor={Colors.textMuted}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Sort Filters */}
      <View style={styles.sortRow}>
        <SortButton label="All" value="default" />
        <SortButton label="📈 Top Gainers" value="gainers" />
        <SortButton label="📉 Top Losers" value="losers" />
      </View>

      {/* Stock List */}
      <FlatList
        data={filteredStocks()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StockListItem
            stock={item}
            onPress={handleStockPress}
            showSector
          />
        )}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No stocks found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
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
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
    padding: 0,
  },
  sortRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  sortBtnActive: {
    backgroundColor: Colors.accentDim,
    borderColor: Colors.accent,
  },
  sortBtnText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  sortBtnTextActive: {
    color: Colors.accent,
  },
  list: {
    flex: 1,
  },
  listContent: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 15,
    marginTop: 12,
  },
});

export default MarketsScreen;
