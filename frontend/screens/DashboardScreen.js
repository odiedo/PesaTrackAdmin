import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const AdminDashboardScreen = ({ navigation }) => {
  const [dailySales, setDailySales] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [dailySalesData, setDailySalesData] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const checkSession = async () => {
      const sessionId = await AsyncStorage.getItem('session_token');
      if (!sessionId) {
        Alert.alert('Session Expired', 'Your session has expired. Please log in again.');
        navigation.replace('SignIn');
      }
    };

    checkSession(); // Check if session exists on component mount
    fetchSalesData(); // Fetch sales data on mount
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await fetch('http://192.168.100.20/payment/admin/dashboard_cal.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (data.success) {
        setDailySales(data.today_sales);
        setMonthlySales(data.month_sales);
        setDailySalesData(data.daily_sales_data || []); // Safely set to an empty array if undefined
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch sales data');
    }
  };
  

  const handleLogout = async () => {
    try {
      const response = await fetch('http://192.168.100.20/payment/admin/logout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.removeItem('session_token');
        Alert.alert('Success', 'Logged out successfully');
        navigation.replace('Signin'); 
      } else {
        Alert.alert('Error', 'Failed to log out');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Logout Button */}
      <View style={styles.header}>
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>Dashboard</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" style={styles.headerText} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Dashboard */}
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <TouchableOpacity>
              <View style={styles.cardBuild}>
                <Text style={styles.cardTitle}>Today's Sales </Text>
                <Ionicons name="cash-outline" size={30} color="#333" />
              </View>
              <Text style={styles.cardValueText}>
                Kshs. <Text style={styles.cardValue}>{dailySales}</Text>
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate('MonthlySales')}>
              <View style={styles.cardBuild}>
                <Text style={styles.cardTitle}>Monthly Sales</Text>
                <Ionicons name="calendar-outline" size={30} color="#333" />
              </View>
              <Text style={styles.cardValueText}>
                Kshs. <Text style={styles.cardValue}>{monthlySales}</Text> {/* Updated to display monthlySales */}
              </Text>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("ManageInventory")}>
            <Ionicons name="swap-horizontal-outline" size={30} color="#333" style={styles.actionBtnIcons} />
            <Text style={styles.actionButtonText}>Trade</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Expenses")}>
            <Ionicons name="cash-outline" size={30} color="#333" style={styles.actionBtnIcons} />
            <Text style={styles.actionButtonText}>Expense </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("ManageInventory")}>
            <Ionicons name="albums-outline" size={30} color="#333" style={styles.actionBtnIcons} />
            <Text style={styles.actionButtonText}>Manage Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("UserPermissions")}>
            <Ionicons name="people-outline" size={30} color="#333" style={styles.actionBtnIcons} />
            <Text style={styles.actionButtonText}>User Permissions</Text>
          </TouchableOpacity>
        </View>

        {/* View Detailed Reports */}
        <TouchableOpacity style={styles.viewReportsButton} onPress={() => navigation.navigate('SalesAnalytics')}>
          <Ionicons name="bar-chart-outline" size={30} color="#333" style={styles.detailedIcon} />
          <Text style={styles.viewReportsText}>Detailed Reports</Text>
        </TouchableOpacity>

        {/* Analytics Section */}
        <Text style={styles.sectionTitle}>Sales Analytics (kshs)</Text>
        <BarChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ data: dailySalesData }],
          }}
          width={screenWidth - 40}
          height={200}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          style={styles.chart}
        />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Ionicons name="home" size={30} color="#007aff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ManageInventory')}>
          <Ionicons name="clipboard-outline" size={30} color="#333" />
          <Text style={styles.navText}>Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SalesAnalytics')}>
          <Ionicons name="bar-chart-outline" size={30} color="#333" />
          <Text style={styles.navText}>Sales</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={30} color="#333" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={fetchSalesData}>
          <Ionicons name="refresh-outline" size={30} color="#333" />
          <Text style={styles.navText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingTop: 40,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: '#007aff',
  },
  headerBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 1,
  },
  scrollContainer: {
    flexGrow:  1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'serif',
    color: '#333',
    marginVertical: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardBuild: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 10,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007aff',
    paddingTop: 10,
  },
  chart: {
    marginVertical: 20,
    borderRadius: 16,
  },
  viewReportsButton: {
    backgroundColor: '#007aff',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailedIcon: {
    color: '#fff'
  },
  viewReportsText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  actionBtnIcons: {
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  actionButtonText: {
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  navText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 12,
  },
});

export default AdminDashboardScreen;
