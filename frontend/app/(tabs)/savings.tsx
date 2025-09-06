import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface SavingsMetric {
  title: string;
  value: string;
  change: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  isPositive: boolean;
}

interface RecentSaving {
  id: string;
  type: 'ride' | 'grocery';
  provider: string;
  item: string;
  savedAmount: number;
  date: string;
  originalPrice: number;
  finalPrice: number;
}

const mockSavingsMetrics: SavingsMetric[] = [
  {
    title: 'Total Savings',
    value: '₹0',
    change: '+₹0 this month',
    icon: 'wallet',
    color: '#00CC66',
    isPositive: true,
  },
  {
    title: 'Avg. Saving per Trip',
    value: '₹0',
    change: 'vs last month',
    icon: 'car',
    color: '#0066CC',
    isPositive: true,
  },
  {
    title: 'Grocery Savings',
    value: '₹0',
    change: '+₹0 this week',
    icon: 'basket',
    color: '#FF9500',
    isPositive: true,
  },
  {
    title: 'Comparisons Made',
    value: '0',
    change: '+0 this week',
    icon: 'analytics',
    color: '#9B59B6',
    isPositive: true,
  },
];

const mockRecentSavings: RecentSaving[] = [
  // Will be populated once user starts using the app
];

const MetricCard: React.FC<{ metric: SavingsMetric }> = ({ metric }) => (
  <View style={styles.metricCard}>
    <View style={styles.metricHeader}>
      <Ionicons name={metric.icon} size={24} color={metric.color} />
      <Text style={styles.metricValue}>{metric.value}</Text>
    </View>
    <Text style={styles.metricTitle}>{metric.title}</Text>
    <Text style={[
      styles.metricChange, 
      { color: metric.isPositive ? '#00CC66' : '#FF6B6B' }
    ]}>
      {metric.change}
    </Text>
  </View>
);

const SavingItem: React.FC<{ saving: RecentSaving }> = ({ saving }) => (
  <View style={styles.savingItem}>
    <View style={styles.savingIcon}>
      <Ionicons 
        name={saving.type === 'ride' ? 'car' : 'basket'} 
        size={20} 
        color={saving.type === 'ride' ? '#0066CC' : '#00CC66'} 
      />
    </View>
    <View style={styles.savingDetails}>
      <Text style={styles.savingProvider}>{saving.provider}</Text>
      <Text style={styles.savingItem}>{saving.item}</Text>
      <Text style={styles.savingDate}>{saving.date}</Text>
    </View>
    <View style={styles.savingAmount}>
      <Text style={styles.savedText}>Saved</Text>
      <Text style={styles.savedAmount}>₹{saving.savedAmount}</Text>
    </View>
  </View>
);

export default function SavingsScreen() {
  const hasActivity = mockRecentSavings.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Savings</Text>
          <Text style={styles.headerSubtitle}>Track your money saved through smart choices</Text>
        </View>

        {/* Savings Overview */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.metricsGrid}>
            {mockSavingsMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionContent}>
              <Ionicons name="trending-up" size={24} color="#0066CC" />
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Set Savings Goal</Text>
                <Text style={styles.actionSubtitle}>Target monthly savings amount</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionContent}>
              <Ionicons name="notifications" size={24} color="#00CC66" />
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Price Alerts</Text>
                <Text style={styles.actionSubtitle}>Get notified about price drops</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionContent}>
              <Ionicons name="download" size={24} color="#FF9500" />
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Export Data</Text>
                <Text style={styles.actionSubtitle}>Download your savings report</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          {hasActivity ? (
            mockRecentSavings.map((saving) => (
              <SavingItem key={saving.id} saving={saving} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="bar-chart-outline" size={64} color="#ccc" />
              <Text style={styles.emptyStateTitle}>No savings yet</Text>
              <Text style={styles.emptyStateText}>
                Start comparing prices to see your savings here
              </Text>
              <View style={styles.emptyStateActions}>
                <TouchableOpacity style={styles.emptyActionButton}>
                  <Text style={styles.emptyActionText}>Compare Rides</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.emptyActionButton}>
                  <Text style={styles.emptyActionText}>Compare Groceries</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Savings Tips</Text>
          
          <View style={styles.tipCard}>
            <Ionicons name="bulb" size={20} color="#FFD700" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Best Time to Order</Text>
              <Text style={styles.tipText}>
                Avoid surge pricing by comparing rides during off-peak hours (10 AM - 4 PM)
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Ionicons name="basket" size={20} color="#00CC66" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Smart Grocery Shopping</Text>
              <Text style={styles.tipText}>
                Compare price per unit to get the best value, especially for bulk items
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Ionicons name="card" size={20} color="#9B59B6" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Use Wallet Credits</Text>
              <Text style={styles.tipText}>
                Link your accounts to see effective prices after applying wallet balance
              </Text>
            </View>
          </View>
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
  metricsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2, // Account for padding and gap
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  metricTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsSection: {
    padding: 20,
    paddingTop: 0,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionText: {
    flex: 1,
    marginLeft: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  activitySection: {
    padding: 20,
    paddingTop: 0,
  },
  savingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  savingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingDetails: {
    flex: 1,
    marginLeft: 12,
  },
  savingProvider: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  savingItem: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  savingDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  savingAmount: {
    alignItems: 'flex-end',
  },
  savedText: {
    fontSize: 12,
    color: '#666',
  },
  savedAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00CC66',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyStateActions: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyActionButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  emptyActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  tipsSection: {
    padding: 20,
    paddingTop: 0,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});