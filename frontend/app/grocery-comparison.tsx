import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface DetailedGroceryItem {
  provider: string;
  productName: string;
  brand: string;
  size: string;
  unitType: string;
  price: number;
  pricePerUnit: number;
  mrp: number;
  discount: number;
  deliveryFee: number;
  deliveryTime: string;
  rating: number;
  reviewCount: number;
  color: string;
  inStock: boolean;
  freshGuarantee: boolean;
  offers: string[];
}

const mockDetailedGroceries: DetailedGroceryItem[] = [
  {
    provider: 'BigBasket',
    productName: 'Basmati Rice',
    brand: 'India Gate',
    size: '5 kg',
    unitType: 'kg',
    price: 510,
    pricePerUnit: 102,
    mrp: 600,
    discount: 90,
    deliveryFee: 40,
    deliveryTime: '2-4 hours',
    rating: 4.2,
    reviewCount: 1580,
    color: '#27AE60',
    inStock: true,
    freshGuarantee: true,
    offers: ['Buy 2 Get 5% Off', 'Free Delivery above ₹200'],
  },
  {
    provider: 'Zepto',
    productName: 'Basmati Rice',
    brand: 'India Gate',
    size: '5 kg',
    unitType: 'kg',
    price: 535,
    pricePerUnit: 107,
    mrp: 550,
    discount: 15,
    deliveryFee: 0,
    deliveryTime: '8-12 mins',
    rating: 4.5,
    reviewCount: 890,
    color: '#E74C3C',
    inStock: true,
    freshGuarantee: false,
    offers: ['Free Delivery', 'Express Delivery'],
  },
  {
    provider: 'Blinkit',
    productName: 'Basmati Rice',
    brand: 'India Gate',
    size: '5 kg',
    unitType: 'kg',
    price: 520,
    pricePerUnit: 104,
    mrp: 550,
    discount: 30,
    deliveryFee: 0,
    deliveryTime: '10-15 mins',
    rating: 4.4,
    reviewCount: 2100,
    color: '#FF6B35',
    inStock: true,
    freshGuarantee: true,
    offers: ['First Order 10% Off', 'Free Delivery'],
  },
  {
    provider: 'Instamart',
    productName: 'Basmati Rice',
    brand: 'India Gate',
    size: '5 kg',
    unitType: 'kg',
    price: 540,
    pricePerUnit: 108,
    mrp: 580,
    discount: 40,
    deliveryFee: 25,
    deliveryTime: '15-25 mins',
    rating: 4.3,
    reviewCount: 750,
    color: '#9B59B6',
    inStock: true,
    freshGuarantee: true,
    offers: ['Weekend Special', 'Bulk Order Discount'],
  },
];

const DetailedGroceryCard: React.FC<{ item: DetailedGroceryItem; rank: number }> = ({ item, rank }) => {
  const totalCost = item.price + item.deliveryFee;
  const savings = item.mrp - item.price;

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return { backgroundColor: '#00CC66', text: 'BEST VALUE' };
      case 2:
        return { backgroundColor: '#FF9500', text: '2ND BEST' };
      case 3:
        return { backgroundColor: '#0066CC', text: '3RD OPTION' };
      default:
        return { backgroundColor: '#666', text: `#${rank}` };
    }
  };

  const rankStyle = getRankStyle(rank);

  return (
    <View style={styles.detailedCard}>
      <View style={[styles.rankBadge, { backgroundColor: rankStyle.backgroundColor }]}>
        <Text style={styles.rankText}>{rankStyle.text}</Text>
      </View>

      {!item.inStock && (
        <View style={styles.outOfStockOverlay}>
          <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
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
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Text style={styles.reviewCount}>({item.reviewCount})</Text>
            </View>
          </View>
        </View>
        <View style={styles.deliveryInfo}>
          <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
          <Text style={styles.deliveryFee}>
            {item.deliveryFee === 0 ? 'Free delivery' : `₹${item.deliveryFee} delivery`}
          </Text>
        </View>
      </View>

      <View style={styles.productSection}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.productDetails}>{item.brand} • {item.size}</Text>
        
        <View style={styles.priceSection}>
          <View style={styles.priceInfo}>
            <Text style={styles.mrpPrice}>MRP ₹{item.mrp}</Text>
            <Text style={[styles.finalPrice, rank === 1 && styles.bestPriceText]}>₹{item.price}</Text>
            <Text style={styles.unitPrice}>₹{item.pricePerUnit}/{item.unitType}</Text>
          </View>
          <View style={styles.savingsInfo}>
            <Text style={styles.savingsText}>Save ₹{savings}</Text>
            <Text style={styles.discountPercent}>{Math.round((savings / item.mrp) * 100)}% OFF</Text>
          </View>
        </View>
      </View>

      <View style={styles.comparisonMetrics}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Price per {item.unitType}</Text>
          <Text style={[styles.metricValue, rank === 1 && styles.bestMetric]}>₹{item.pricePerUnit}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total Cost</Text>
          <Text style={[styles.metricValue, rank === 1 && styles.bestMetric]}>₹{totalCost}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>You Save</Text>
          <Text style={styles.savingsValue}>₹{savings}</Text>
        </View>
      </View>

      {item.offers.length > 0 && (
        <View style={styles.offersSection}>
          <Text style={styles.offersTitle}>Available Offers</Text>
          {item.offers.map((offer, index) => (
            <View key={index} style={styles.offerItem}>
              <Ionicons name="pricetag" size={14} color="#00CC66" />
              <Text style={styles.offerText}>{offer}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.featuresSection}>
        {item.freshGuarantee && (
          <View style={styles.feature}>
            <Ionicons name="leaf" size={16} color="#00CC66" />
            <Text style={styles.featureText}>Fresh Guarantee</Text>
          </View>
        )}
        <View style={styles.feature}>
          <Ionicons name="shield-checkmark" size={16} color="#0066CC" />
          <Text style={styles.featureText}>Quality Assured</Text>
        </View>
        {item.deliveryFee === 0 && (
          <View style={styles.feature}>
            <Ionicons name="bicycle" size={16} color="#FF9500" />
            <Text style={styles.featureText}>Free Delivery</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.addToCartButton,
          { backgroundColor: item.inStock ? item.color : '#ccc' },
          !item.inStock && styles.disabledButton
        ]}
        onPress={() => 
          item.inStock 
            ? Alert.alert('Add to Cart', `Opening ${item.provider} app to add ${item.productName}...`)
            : Alert.alert('Out of Stock', 'This item is currently unavailable')
        }
        disabled={!item.inStock}
      >
        <Text style={styles.addToCartText}>
          {item.inStock ? `Add to Cart • ₹${totalCost}` : 'Out of Stock'}
        </Text>
        {item.inStock && <Ionicons name="cart" size={20} color="#fff" />}
      </TouchableOpacity>
    </View>
  );
};

export default function GroceryComparisonScreen() {
  const [sortBy, setSortBy] = useState<'price' | 'delivery' | 'rating'>('price');

  const getSortedItems = () => {
    const sorted = [...mockDetailedGroceries];
    switch (sortBy) {
      case 'price':
        return sorted.sort((a, b) => (a.price + a.deliveryFee) - (b.price + b.deliveryFee));
      case 'delivery':
        return sorted.sort((a, b) => {
          const timeA = parseInt(a.deliveryTime.split('-')[0]);
          const timeB = parseInt(b.deliveryTime.split('-')[0]);
          return timeA - timeB;
        });
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  };

  const sortedItems = getSortedItems();
  const bestDeal = sortBy === 'price' ? sortedItems[0] : mockDetailedGroceries.find(item => 
    (item.price + item.deliveryFee) === Math.min(...mockDetailedGroceries.map(i => i.price + i.deliveryFee))
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Grocery Analysis</Text>
          <Text style={styles.headerSubtitle}>
            Detailed comparison for Basmati Rice
          </Text>
        </View>

        <View style={styles.sortingSection}>
          <Text style={styles.sortTitle}>Sort by:</Text>
          <View style={styles.sortButtons}>
            {[
              { key: 'price', label: 'Best Price' },
              { key: 'delivery', label: 'Fastest' },
              { key: 'rating', label: 'Top Rated' }
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortButton,
                  sortBy === option.key && styles.activeSortButton
                ]}
                onPress={() => setSortBy(option.key as 'price' | 'delivery' | 'rating')}
              >
                <Text style={[
                  styles.sortButtonText,
                  sortBy === option.key && styles.activeSortButtonText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.comparisonSection}>
          {sortedItems.map((item, index) => (
            <DetailedGroceryCard
              key={`${item.provider}-${item.productName}`}
              item={item}
              rank={sortBy === 'price' ? index + 1 : (item === bestDeal ? 1 : index + 2)}
            />
          ))}
        </View>

        <View style={styles.insights}>
          <Text style={styles.insightsTitle}>📊 Price Analysis</Text>
          <Text style={styles.insightText}>
            • Best value: {bestDeal?.provider} at ₹{bestDeal?.pricePerUnit}/kg
          </Text>
          <Text style={styles.insightText}>
            • Price range: ₹{Math.min(...mockDetailedGroceries.map(i => i.pricePerUnit))} - ₹{Math.max(...mockDetailedGroceries.map(i => i.pricePerUnit))} per kg
          </Text>
          <Text style={styles.insightText}>
            • Fastest delivery: Zepto (8-12 mins)
          </Text>
          <Text style={styles.insightText}>
            • Maximum savings: ₹{Math.max(...mockDetailedGroceries.map(i => i.mrp - i.price))} off MRP
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  sortingSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 1,
  },
  sortTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeSortButton: {
    backgroundColor: '#0066CC',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeSortButtonText: {
    color: '#fff',
  },
  comparisonSection: {
    padding: 20,
  },
  detailedCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rankBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rankText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  providerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerInitial: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  providerDetails: {
    gap: 4,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
  },
  deliveryInfo: {
    alignItems: 'flex-end',
  },
  deliveryTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deliveryFee: {
    fontSize: 14,
    color: '#666',
  },
  productSection: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceInfo: {
    gap: 2,
  },
  mrpPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  finalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  bestPriceText: {
    color: '#00CC66',
  },
  unitPrice: {
    fontSize: 16,
    color: '#0066CC',
    fontWeight: '500',
  },
  savingsInfo: {
    alignItems: 'flex-end',
    gap: 2,
  },
  savingsText: {
    fontSize: 16,
    color: '#00CC66',
    fontWeight: '600',
  },
  discountPercent: {
    fontSize: 14,
    backgroundColor: '#00CC66',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  comparisonMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bestMetric: {
    color: '#00CC66',
  },
  savingsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00CC66',
  },
  offersSection: {
    marginBottom: 16,
  },
  offersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  offerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  offerText: {
    fontSize: 14,
    color: '#00CC66',
  },
  featuresSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  insights: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
});