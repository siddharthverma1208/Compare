import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface GroceryItem {
  provider: string;
  productName: string;
  brand: string;
  size: string;
  price: number;
  pricePerUnit: number;
  deliveryFee: number;
  deliveryTime: string;
  discount?: number;
  rating: number;
  color: string;
}

// Mock data for grocery comparison
const mockGroceryItems: GroceryItem[] = [
  {
    provider: 'Blinkit',
    productName: 'Basmati Rice',
    brand: 'India Gate',
    size: '5 kg',
    price: 520,
    pricePerUnit: 104, // per kg
    deliveryFee: 0,
    deliveryTime: '10-15 mins',
    discount: 30,
    rating: 4.4,
    color: '#FF6B35',
  },
  {
    provider: 'Instamart',
    productName: 'Basmati Rice',
    brand: 'India Gate',
    size: '5 kg',
    price: 540,
    pricePerUnit: 108, // per kg
    deliveryFee: 25,
    deliveryTime: '15-25 mins',
    rating: 4.3,
    color: '#9B59B6',
  },
  {
    provider: 'Zepto',
    productName: 'Basmati Rice',
    brand: 'India Gate',
    size: '5 kg',
    price: 535,
    pricePerUnit: 107, // per kg
    deliveryFee: 0,
    deliveryTime: '8-12 mins',
    discount: 15,
    rating: 4.5,
    color: '#E74C3C',
  },
  {
    provider: 'BigBasket',
    productName: 'Basmati Rice',
    brand: 'India Gate',
    size: '5 kg',
    price: 510,
    pricePerUnit: 102, // per kg
    deliveryFee: 40,
    deliveryTime: '2-4 hours',
    rating: 4.2,
    color: '#27AE60',
  },
];

const GroceryCard: React.FC<{ item: GroceryItem; isBestPrice: boolean; isFastestDelivery: boolean }> = ({ 
  item, 
  isBestPrice, 
  isFastestDelivery 
}) => {
  const finalPrice = item.price - (item.discount || 0);
  const totalCost = finalPrice + item.deliveryFee;

  return (
    <TouchableOpacity 
      style={[
        styles.groceryCard, 
        (isBestPrice || isFastestDelivery) && styles.highlightedCard
      ]}
      onPress={() => Alert.alert('Add to Cart', `Opening ${item.provider} app...`)}
    >
      {(isBestPrice || isFastestDelivery) && (
        <View style={styles.badgeContainer}>
          {isBestPrice && (
            <View style={[styles.badge, styles.bestPriceBadge]}>
              <Text style={styles.badgeText}>BEST PRICE</Text>
            </View>
          )}
          {isFastestDelivery && (
            <View style={[styles.badge, styles.fastestBadge]}>
              <Text style={styles.badgeText}>FASTEST</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.cardHeader}>
        <View style={styles.providerInfo}>
          <View style={[styles.providerIcon, { backgroundColor: item.color }]}>
            <Text style={styles.providerInitial}>{item.provider[0]}</Text>
          </View>
          <View style={styles.providerDetails}>
            <Text style={styles.providerName}>{item.provider}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceInfo}>
          {item.discount && (
            <Text style={styles.originalPrice}>₹{item.price}</Text>
          )}
          <Text style={[styles.finalPrice, isBestPrice && styles.bestPriceText]}>
            ₹{finalPrice}
          </Text>
        </View>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.productDetails}>{item.brand} • {item.size}</Text>
        <Text style={styles.unitPrice}>₹{item.pricePerUnit}/kg</Text>
      </View>

      <View style={styles.deliveryInfo}>
        <View style={styles.deliveryItem}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.deliveryText}>{item.deliveryTime}</Text>
        </View>
        <View style={styles.deliveryItem}>
          <Ionicons name="bicycle-outline" size={16} color="#666" />
          <Text style={styles.deliveryText}>
            {item.deliveryFee === 0 ? 'Free delivery' : `₹${item.deliveryFee} delivery`}
          </Text>
        </View>
      </View>

      <View style={styles.totalCostContainer}>
        <Text style={styles.totalCostLabel}>Total Cost:</Text>
        <Text style={styles.totalCost}>₹{totalCost}</Text>
      </View>

      {item.discount && (
        <View style={styles.discountBanner}>
          <Ionicons name="pricetag" size={14} color="#00CC66" />
          <Text style={styles.discountText}>Save ₹{item.discount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function GroceriesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Search Required', 'Please enter a product to search for');
      return;
    }
    setShowResults(true);
  };

  const sortedByPrice = [...mockGroceryItems].sort((a, b) => {
    const totalA = (a.price - (a.discount || 0)) + a.deliveryFee;
    const totalB = (b.price - (b.discount || 0)) + b.deliveryFee;
    return totalA - totalB;
  });

  const sortedByDelivery = [...mockGroceryItems].sort((a, b) => {
    const timeA = parseInt(a.deliveryTime.split('-')[0]);
    const timeB = parseInt(b.deliveryTime.split('-')[0]);
    return timeA - timeB;
  });

  const bestPriceProvider = sortedByPrice[0]?.provider;
  const fastestProvider = sortedByDelivery[0]?.provider;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Compare Groceries</Text>
            <Text style={styles.headerSubtitle}>Find the best prices with unit comparisons</Text>
          </View>

          {/* Search Input */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for products (e.g., rice, milk, oil)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Compare Prices</Text>
              <Ionicons name="analytics-outline" size={20} color="#fff" />
            </TouchableOpacity>

            {/* Quick Categories */}
            <View style={styles.categoriesContainer}>
              <Text style={styles.categoriesTitle}>Quick Categories:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryButtons}>
                  {['Rice', 'Milk', 'Oil', 'Flour', 'Sugar', 'Tea'].map((category) => (
                    <TouchableOpacity 
                      key={category}
                      style={styles.categoryButton}
                      onPress={() => {
                        setSearchQuery(category);
                        setShowResults(true);
                      }}
                    >
                      <Text style={styles.categoryButtonText}>{category}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Results */}
          {showResults && (
            <View style={styles.resultsSection}>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>Price Comparison</Text>
                <Text style={styles.resultsSubtitle}>
                  {mockGroceryItems.length} options found for "{searchQuery || 'Basmati Rice'}"
                </Text>
              </View>

              {sortedByPrice.map((item) => (
                <GroceryCard
                  key={`${item.provider}-${item.productName}`}
                  item={item}
                  isBestPrice={item.provider === bestPriceProvider}
                  isFastestDelivery={item.provider === fastestProvider}
                />
              ))}

              <TouchableOpacity 
                style={styles.viewDetailedComparison}
                onPress={() => router.push('/grocery-comparison')}
              >
                <Text style={styles.viewDetailedText}>View Detailed Analysis</Text>
                <Ionicons name="arrow-forward" size={16} color="#00CC66" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00CC66',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryButtonText: {
    color: '#0066CC',
    fontSize: 12,
    fontWeight: '500',
  },
  resultsSection: {
    padding: 20,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  resultsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  groceryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  highlightedCard: {
    borderColor: '#00CC66',
    borderWidth: 2,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bestPriceBadge: {
    backgroundColor: '#00CC66',
  },
  fastestBadge: {
    backgroundColor: '#FF9500',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  providerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerInitial: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  providerDetails: {
    gap: 2,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  finalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  bestPriceText: {
    color: '#00CC66',
  },
  productInfo: {
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  productDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  unitPrice: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '500',
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deliveryText: {
    fontSize: 14,
    color: '#666',
  },
  totalCostContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalCostLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  discountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fff4',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    gap: 6,
  },
  discountText: {
    fontSize: 12,
    color: '#00CC66',
    fontWeight: '500',
  },
  viewDetailedComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fff4',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    gap: 8,
  },
  viewDetailedText: {
    color: '#00CC66',
    fontSize: 14,
    fontWeight: '500',
  },
});