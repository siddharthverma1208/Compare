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

interface RideOption {
  provider: string;
  vehicleType: string;
  estimatedFare: number;
  surgeMultiplier?: number;
  estimatedTime: string;
  distance: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  couponDiscount?: number;
  walletBalance?: number;
}

// Mock data for ride comparison
const mockRideOptions: RideOption[] = [
  {
    provider: 'Uber',
    vehicleType: 'UberGo',
    estimatedFare: 120,
    estimatedTime: '8-12 mins',
    distance: '5.2 km',
    icon: 'car',
    color: '#000',
    couponDiscount: 20,
  },
  {
    provider: 'Ola',
    vehicleType: 'Mini',
    estimatedFare: 110,
    surgeMultiplier: 1.2,
    estimatedTime: '10-15 mins',
    distance: '5.2 km',
    icon: 'car-outline',
    color: '#00D4AA',
    walletBalance: 50,
  },
  {
    provider: 'Rapido',
    vehicleType: 'Bike',
    estimatedFare: 35,
    estimatedTime: '12-18 mins',
    distance: '5.2 km',
    icon: 'bicycle',
    color: '#FFD700',
  },
  {
    provider: 'Namma Yatri',
    vehicleType: 'Auto',
    estimatedFare: 65,
    estimatedTime: '15-20 mins',
    distance: '5.2 km',
    icon: 'car-sport',
    color: '#4CAF50',
  },
];

const RideCard: React.FC<{ ride: RideOption; isLowest: boolean }> = ({ ride, isLowest }) => {
  const effectiveFare = ride.estimatedFare - (ride.couponDiscount || 0) - (ride.walletBalance || 0);
  
  return (
    <TouchableOpacity 
      style={[styles.rideCard, isLowest && styles.lowestPriceCard]}
      onPress={() => Alert.alert('Book Ride', `Opening ${ride.provider} app...`)}
    >
      {isLowest && (
        <View style={styles.bestDealBadge}>
          <Text style={styles.bestDealText}>BEST DEAL</Text>
        </View>
      )}
      
      <View style={styles.rideHeader}>
        <View style={styles.providerInfo}>
          <Ionicons name={ride.icon} size={24} color={ride.color} />
          <View style={styles.providerText}>
            <Text style={styles.providerName}>{ride.provider}</Text>
            <Text style={styles.vehicleType}>{ride.vehicleType}</Text>
          </View>
        </View>
        <View style={styles.fareInfo}>
          {effectiveFare !== ride.estimatedFare && (
            <Text style={styles.originalFare}>₹{ride.estimatedFare}</Text>
          )}
          <Text style={[styles.finalFare, isLowest && styles.lowestFareText]}>
            ₹{effectiveFare}
          </Text>
        </View>
      </View>

      <View style={styles.rideDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{ride.estimatedTime}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{ride.distance}</Text>
        </View>
      </View>

      {(ride.surgeMultiplier || ride.couponDiscount || ride.walletBalance) && (
        <View style={styles.additionalInfo}>
          {ride.surgeMultiplier && (
            <View style={styles.surgeInfo}>
              <Ionicons name="trending-up" size={14} color="#FF6B6B" />
              <Text style={styles.surgeText}>{ride.surgeMultiplier}x Surge</Text>
            </View>
          )}
          {ride.couponDiscount && (
            <View style={styles.discountInfo}>
              <Ionicons name="pricetag" size={14} color="#00CC66" />
              <Text style={styles.discountText}>-₹{ride.couponDiscount} Coupon</Text>
            </View>
          )}
          {ride.walletBalance && (
            <View style={styles.walletInfo}>
              <Ionicons name="wallet" size={14} color="#0066CC" />
              <Text style={styles.walletText}>-₹{ride.walletBalance} Wallet</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function RidesScreen() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleCompare = () => {
    if (!pickup.trim() || !destination.trim()) {
      Alert.alert('Missing Information', 'Please enter both pickup and destination locations');
      return;
    }
    setShowResults(true);
  };

  const sortedRides = [...mockRideOptions].sort((a, b) => {
    const fareA = a.estimatedFare - (a.couponDiscount || 0) - (a.walletBalance || 0);
    const fareB = b.estimatedFare - (b.couponDiscount || 0) - (b.walletBalance || 0);
    return fareA - fareB;
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Compare Rides</Text>
            <Text style={styles.headerSubtitle}>Find the best deals from all providers</Text>
          </View>

          {/* Location Input */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <Ionicons name="radio-button-on" size={20} color="#00CC66" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter pickup location"
                value={pickup}
                onChangeText={setPickup}
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.inputSeparator}>
              <View style={styles.separatorLine} />
              <TouchableOpacity style={styles.swapButton}>
                <Ionicons name="swap-vertical" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="location" size={20} color="#FF6B6B" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter destination"
                value={destination}
                onChangeText={setDestination}
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity style={styles.compareButton} onPress={handleCompare}>
              <Text style={styles.compareButtonText}>Compare Rides</Text>
              <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Results */}
          {showResults && (
            <View style={styles.resultsSection}>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>Available Options</Text>
                <Text style={styles.resultsSubtitle}>
                  {sortedRides.length} providers found
                </Text>
              </View>

              {sortedRides.map((ride, index) => (
                <RideCard 
                  key={`${ride.provider}-${ride.vehicleType}`}
                  ride={ride} 
                  isLowest={index === 0}
                />
              ))}

              <TouchableOpacity 
                style={styles.viewAllComparison}
                onPress={() => router.push('/ride-comparison')}
              >
                <Text style={styles.viewAllText}>View Detailed Comparison</Text>
                <Ionicons name="arrow-forward" size={16} color="#0066CC" />
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
  inputSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  inputSeparator: {
    alignItems: 'center',
    marginVertical: 8,
    position: 'relative',
  },
  separatorLine: {
    width: 2,
    height: 20,
    backgroundColor: '#e0e0e0',
  },
  swapButton: {
    position: 'absolute',
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066CC',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 8,
  },
  compareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  lowestPriceCard: {
    borderColor: '#00CC66',
    borderWidth: 2,
  },
  bestDealBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#00CC66',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bestDealText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  rideHeader: {
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
  providerText: {
    gap: 2,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  vehicleType: {
    fontSize: 14,
    color: '#666',
  },
  fareInfo: {
    alignItems: 'flex-end',
  },
  originalFare: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  finalFare: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  lowestFareText: {
    color: '#00CC66',
  },
  rideDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  additionalInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  surgeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  surgeText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  discountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  discountText: {
    fontSize: 12,
    color: '#00CC66',
    fontWeight: '500',
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  walletText: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '500',
  },
  viewAllComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    gap: 8,
  },
  viewAllText: {
    color: '#0066CC',
    fontSize: 14,
    fontWeight: '500',
  },
});