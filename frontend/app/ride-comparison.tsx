import React from 'react';
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

interface DetailedRideOption {
  provider: string;
  vehicleType: string;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  serviceFee: number;
  gst: number;
  surge?: number;
  couponDiscount?: number;
  walletBalance?: number;
  estimatedTime: string;
  distance: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  features: string[];
}

const mockDetailedRides: DetailedRideOption[] = [
  {
    provider: 'Uber',
    vehicleType: 'UberGo',
    baseFare: 50,
    distanceFare: 45,
    timeFare: 15,
    serviceFee: 5,
    gst: 15,
    couponDiscount: 20,
    estimatedTime: '8-12 mins',
    distance: '5.2 km',
    icon: 'car',
    color: '#000',
    features: ['AC Car', 'GPS Tracking', '24/7 Support'],
  },
  {
    provider: 'Ola',
    vehicleType: 'Mini',
    baseFare: 45,
    distanceFare: 40,
    timeFare: 12,
    serviceFee: 8,
    gst: 12,
    surge: 15,
    walletBalance: 50,
    estimatedTime: '10-15 mins',
    distance: '5.2 km',
    icon: 'car-outline',
    color: '#00D4AA',
    features: ['AC Car', 'Safety Features', 'Easy Cancellation'],
  },
  {
    provider: 'Rapido',
    vehicleType: 'Bike',
    baseFare: 20,
    distanceFare: 12,
    timeFare: 3,
    serviceFee: 2,
    gst: 3,
    estimatedTime: '12-18 mins',
    distance: '5.2 km',
    icon: 'bicycle',
    color: '#FFD700',
    features: ['Fastest Route', 'Helmet Provided', 'Eco-Friendly'],
  },
  {
    provider: 'Namma Yatri',
    vehicleType: 'Auto',
    baseFare: 30,
    distanceFare: 25,
    timeFare: 8,
    serviceFee: 0,
    gst: 5,
    estimatedTime: '15-20 mins',
    distance: '5.2 km',
    icon: 'car-sport',
    color: '#4CAF50',
    features: ['Fixed Fare', 'No Commission', 'Local Drivers'],
  },
];

const DetailedRideCard: React.FC<{ ride: DetailedRideOption; rank: number }> = ({ ride, rank }) => {
  const subtotal = ride.baseFare + ride.distanceFare + ride.timeFare + ride.serviceFee;
  const surgeAmount = ride.surge || 0;
  const grossTotal = subtotal + surgeAmount + ride.gst;
  const discounts = (ride.couponDiscount || 0) + (ride.walletBalance || 0);
  const finalAmount = grossTotal - discounts;

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return { backgroundColor: '#00CC66', text: 'BEST DEAL' };
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

      <View style={styles.cardHeader}>
        <View style={styles.providerInfo}>
          <Ionicons name={ride.icon} size={28} color={ride.color} />
          <View style={styles.providerDetails}>
            <Text style={styles.providerName}>{ride.provider}</Text>
            <Text style={styles.vehicleType}>{ride.vehicleType}</Text>
          </View>
        </View>
        <View style={styles.timeDistance}>
          <Text style={styles.timeText}>{ride.estimatedTime}</Text>
          <Text style={styles.distanceText}>{ride.distance}</Text>
        </View>
      </View>

      <View style={styles.fareBreakdown}>
        <Text style={styles.breakdownTitle}>Fare Breakdown</Text>
        
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Base Fare</Text>
          <Text style={styles.breakdownValue}>₹{ride.baseFare}</Text>
        </View>
        
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Distance ({ride.distance})</Text>
          <Text style={styles.breakdownValue}>₹{ride.distanceFare}</Text>
        </View>
        
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Time ({ride.estimatedTime})</Text>
          <Text style={styles.breakdownValue}>₹{ride.timeFare}</Text>
        </View>
        
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Service Fee</Text>
          <Text style={styles.breakdownValue}>₹{ride.serviceFee}</Text>
        </View>

        {surgeAmount > 0 && (
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, styles.surgeLabel]}>Surge Pricing</Text>
            <Text style={[styles.breakdownValue, styles.surgeValue]}>+₹{surgeAmount}</Text>
          </View>
        )}
        
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>GST</Text>
          <Text style={styles.breakdownValue}>₹{ride.gst}</Text>
        </View>

        <View style={styles.subtotalRow}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.subtotalValue}>₹{grossTotal}</Text>
        </View>

        {ride.couponDiscount && (
          <View style={styles.discountRow}>
            <Text style={styles.discountLabel}>Coupon Discount</Text>
            <Text style={styles.discountValue}>-₹{ride.couponDiscount}</Text>
          </View>
        )}

        {ride.walletBalance && (
          <View style={styles.discountRow}>
            <Text style={styles.discountLabel}>Wallet Balance</Text>
            <Text style={styles.discountValue}>-₹{ride.walletBalance}</Text>
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={[styles.totalValue, rank === 1 && styles.bestPrice]}>₹{finalAmount}</Text>
        </View>
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>Features</Text>
        <View style={styles.featuresList}>
          {ride.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#00CC66" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.bookButton, { backgroundColor: ride.color }]}
        onPress={() => Alert.alert('Book Ride', `Opening ${ride.provider} app to book ${ride.vehicleType}...`)}
      >
        <Text style={styles.bookButtonText}>Book with {ride.provider}</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default function RideComparisonScreen() {
  const sortedRides = [...mockDetailedRides].sort((a, b) => {
    const totalA = a.baseFare + a.distanceFare + a.timeFare + a.serviceFee + a.gst + (a.surge || 0) - (a.couponDiscount || 0) - (a.walletBalance || 0);
    const totalB = b.baseFare + b.distanceFare + b.timeFare + b.serviceFee + b.gst + (b.surge || 0) - (b.couponDiscount || 0) - (b.walletBalance || 0);
    return totalA - totalB;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Detailed Comparison</Text>
          <Text style={styles.headerSubtitle}>
            Complete fare breakdown for Home to Office
          </Text>
        </View>

        <View style={styles.comparisonSection}>
          {sortedRides.map((ride, index) => (
            <DetailedRideCard
              key={`${ride.provider}-${ride.vehicleType}`}
              ride={ride}
              rank={index + 1}
            />
          ))}
        </View>

        <View style={styles.insights}>
          <Text style={styles.insightsTitle}>💡 Smart Insights</Text>
          <Text style={styles.insightText}>
            • Best value: {sortedRides[0].provider} saves you ₹{
              (sortedRides[1].baseFare + sortedRides[1].distanceFare + sortedRides[1].timeFare + sortedRides[1].serviceFee + sortedRides[1].gst + (sortedRides[1].surge || 0) - (sortedRides[1].couponDiscount || 0) - (sortedRides[1].walletBalance || 0)) -
              (sortedRides[0].baseFare + sortedRides[0].distanceFare + sortedRides[0].timeFare + sortedRides[0].serviceFee + sortedRides[0].gst + (sortedRides[0].surge || 0) - (sortedRides[0].couponDiscount || 0) - (sortedRides[0].walletBalance || 0))
            }
          </Text>
          <Text style={styles.insightText}>
            • Fastest option: Rapido (12-18 mins)
          </Text>
          <Text style={styles.insightText}>
            • Current surge on Ola due to high demand
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  providerDetails: {
    gap: 2,
  },
  providerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  vehicleType: {
    fontSize: 16,
    color: '#666',
  },
  timeDistance: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
  },
  fareBreakdown: {
    marginBottom: 20,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666',
  },
  breakdownValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  surgeLabel: {
    color: '#FF6B6B',
  },
  surgeValue: {
    color: '#FF6B6B',
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 8,
  },
  subtotalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  subtotalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  discountLabel: {
    fontSize: 14,
    color: '#00CC66',
  },
  discountValue: {
    fontSize: 14,
    color: '#00CC66',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  bestPrice: {
    color: '#00CC66',
  },
  featuresSection: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  featuresList: {
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  bookButtonText: {
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