import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
const screenWidth = Dimensions.get('window').width;

const DetailedReportScreen = ({ navigation }) => {
  const [dailySales, setDailySales] = useState(0);
  const [weeklySales, setWeeklySales] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [dailyExpenses, setDailyExpenses] = useState(0);
  const [weeklyExpenses, setWeeklyExpenses] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [salesData, setSalesData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [expenseData, setExpenseData] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    // Mock fetching data
    const fetchReportData = async () => {
      setDailySales(5000);
      setWeeklySales(35000);
      setMonthlySales(150000);
      setDailyExpenses(2000);
      setWeeklyExpenses(12000);
      setMonthlyExpenses(50000);

      setSalesData([1200, 1000, 2500, 4000, 4500, 2000, 5000]);
      setExpenseData([500, 700, 1200, 900, 1000, 1500, 2000]);
    };

    fetchReportData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Detailed Reports</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Sales Analytics */}
        <Text style={styles.sectionTitle}>Sales Analytics</Text>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today's Sales</Text>
            <Text style={styles.cardValue}>Kshs. {dailySales}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Weekly Sales</Text>
            <Text style={styles.cardValue}>Kshs. {weeklySales}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Monthly Sales</Text>
            <Text style={styles.cardValue}>Kshs. {monthlySales.toLocaleString()}</Text>
          </View>
        </View>
        <BarChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ data: salesData }],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="Kshs. "
          chartConfig={chartConfig}
          style={styles.chart}
        />

        {/* Expenses Summary */}
        <Text style={styles.sectionTitle}>Expenses Analytics</Text>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Daily Expenses</Text>
            <Text style={styles.cardValue}>Kshs. {dailyExpenses}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Weekly Expenses</Text>
            <Text style={styles.cardValue}>Kshs. {weeklyExpenses}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Monthly Expenses</Text>
            <Text style={styles.cardValue}>Kshs. {monthlyExpenses.toLocaleString()}</Text>
          </View>
        </View>

        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ data: expenseData }],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="Kshs. "
          chartConfig={chartConfig}
          style={styles.chart}
        />

        {/* Back to Dashboard */}
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.goBackButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Ionicons name="home-outline" size={30} color="#333" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ManageInventory')}>
          <Ionicons name="clipboard-outline" size={30} color="#333" />
          <Text style={styles.navText}>Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SalesAnalytics')}>
          <Ionicons name="bar-chart" size={30} color="#007aff" />
          <Text style={styles.navText}>Sales</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={30} color="#333" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const chartConfig = {
  backgroundColor: '#1cc910',
  backgroundGradientFrom: '#eff3ff',
  backgroundGradientTo: '#efefef',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  header: {
    paddingTop: 40,
    backgroundColor: '#007aff',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 10,
    color: '#fff',
    paddingBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginVertical: 5,
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
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007aff',
    marginTop: 10,
  },
  chart: {
    marginVertical: 20,
    borderRadius: 16,
  },
  goBackButton: {
    backgroundColor: '#007aff',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  goBackButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
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

export default DetailedReportScreen;
