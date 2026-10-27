// Bottom Tab Navigator + Stack Navigator setup
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import type { Stock } from '../data/stockData';

// Screens
import HomeScreen from '../screens/HomeScreen';
import MarketsScreen from '../screens/MarketsScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import TradeScreen from '../screens/TradeScreen';

// -----------------------------------------------------------------
// Typed param lists for each stack — this satisfies TS2322 because
// the navigator now knows what props each screen component receives.
// -----------------------------------------------------------------
export type HomeStackParamList = {
  HomeMain: undefined;
  Trade: { stock: Stock };
};

export type MarketsStackParamList = {
  MarketsMain: undefined;
  Trade: { stock: Stock };
};

export type PortfolioStackParamList = {
  PortfolioMain: undefined;
  Trade: { stock: Stock };
};

export type RootTabParamList = {
  Home: undefined;
  Markets: undefined;
  Portfolio: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// Home Stack (Home → Trade)
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Trade" component={TradeScreen} />
    </HomeStack.Navigator>
  );
}

// Markets Stack (Markets → Trade)
const MarketsStack = createNativeStackNavigator<MarketsStackParamList>();
function MarketsStackNavigator() {
  return (
    <MarketsStack.Navigator screenOptions={{ headerShown: false }}>
      <MarketsStack.Screen name="MarketsMain" component={MarketsScreen} />
      <MarketsStack.Screen name="Trade" component={TradeScreen} />
    </MarketsStack.Navigator>
  );
}

// Portfolio Stack (Portfolio → Trade)
const PortfolioStack = createNativeStackNavigator<PortfolioStackParamList>();
function PortfolioStackNavigator() {
  return (
    <PortfolioStack.Navigator screenOptions={{ headerShown: false }}>
      <PortfolioStack.Screen name="PortfolioMain" component={PortfolioScreen} />
      <PortfolioStack.Screen name="Trade" component={TradeScreen} />
    </PortfolioStack.Navigator>
  );
}

// Root Navigator
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.tabBar,
            borderTopColor: Colors.tabBarBorder,
            borderTopWidth: 1,
            height: 80,
            paddingTop: 8,
            paddingBottom: 16,
          },
          tabBarActiveTintColor: Colors.tabActive,
          tabBarInactiveTintColor: Colors.tabInactive,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarIcon: ({ focused, color }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Markets') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            } else if (route.name === 'Portfolio') {
              iconName = focused ? 'briefcase' : 'briefcase-outline';
            }

            return <Ionicons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStackNavigator} />
        <Tab.Screen name="Markets" component={MarketsStackNavigator} />
        <Tab.Screen name="Portfolio" component={PortfolioStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
