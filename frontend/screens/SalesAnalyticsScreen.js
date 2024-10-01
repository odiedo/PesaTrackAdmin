import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const DetailedReportScreen = ({ navigation }) => {
  const [dailySales, setDailySales] = useState(0);
  const [weeklySales, setWeeklySales] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [salesData, setSalesData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [viewMode, setViewMode] = useState('daily');

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch('http://192.168.100.20/payment/admin/detailed_sales.php');
        const data = await response.json();

        if (data.success) {
          setDailySales(data.daily_sales);
          setWeeklySales(data.weekly_sales);
          setMonthlySales(data.monthly_sales);

          if (viewMode === 'daily') {
            // Daily sales data for the current week
            setSalesData(Object.values(data.sales_data)); 
          } else if (viewMode === 'weekly') {
            // Weekly sales data for the current month
            setSalesData(Object.values(data.weekly_sales_data));
          } else if (viewMode === 'monthly') {
            // Quarterly sales data for the year
            setSalesData(Object.values(data.quarterly_sales_data));
          }
        } else {
          console.error('Failed to fetch data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchReportData();
  }, [viewMode]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Sales Analytics</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'daily' && styles.activeButton]}
            onPress={() => setViewMode('daily')}
          >
            <Text style={styles.buttonText}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'weekly' && styles.activeButton]}
            onPress={() => setViewMode('weekly')}
          >
            <Text style={styles.buttonText}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'monthly' && styles.activeButton]}
            onPress={() => setViewMode('monthly')}
          >
            <Text style={styles.buttonText}>Monthly</Text>
          </TouchableOpacity>
        </View>

        {/* Sales summary card */}
        <View style={styles.cardContainer}>
          {viewMode === 'daily' && (
            <View style={styles.card}>
              <View style={styles.cardBo}>
                <Text style={styles.cardTitle}>Average Daily Sales</Text>
                <Text style={styles.cardValue}>Kshs. {dailySales}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('MonthlySales')}>
                <Ionicons name="enter-outline" size={30} color="#333" />
              </TouchableOpacity>
            </View>
          )}
          {viewMode === 'weekly' && (
            <View style={styles.card}>
              <View style={styles.cardBo}>
                <Text style={styles.cardTitle}>Average Weekly Sales</Text>
                <Text style={styles.cardValue}>Kshs. {weeklySales}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('MonthlySales')}>
                <Ionicons name="enter-outline" size={30} color="#333" />
              </TouchableOpacity>
            </View>
          )}
          {viewMode === 'monthly' && (
            <View style={styles.card}>
              <View style={styles.cardBo}>
                <Text style={styles.cardTitle}>Current Month Sales</Text>
                <Text style={styles.cardValue}>Kshs. {monthlySales.toLocaleString()}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('MonthlySales')}>
                <Ionicons name="enter-outline" size={30} color="#333" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bar Chart for Sales Data */}
        <BarChart
          data={{
            labels:
              viewMode === 'daily'
                ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                : viewMode === 'weekly'
                ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
                : ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'],
            datasets: [{ data: salesData }],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="Kshs "
          chartConfig={chartConfig}
          style={styles.chart}
          barPercentage={0.5}
        />

        {/* Sales Report Description */}
        <View style={styles.reportDescription}>

          {viewMode === 'daily' && (
            <View style={styles.descriptionCard}>
              <Text style={styles.reportTitle}>
              <Ionicons name="calendar-outline" size={20} color="#32CD32" /> Daily Sales:
              </Text>
              <Text style={styles.reportText}>
                {' '}
                This bar chart shows the daily sales for the current week. These insights will help you monitor
                day-to-day sales trends and identify peak sales days.
              </Text>
            </View>
          )}
          
          {viewMode === 'weekly' && (
            <View style={styles.descriptionCard}>
              <Text style={styles.reportTitle}>
                <Ionicons name="calendar-number-outline" size={20} color="#32CD32" /> Weekly Sales:
              </Text>
              <Text style={styles.reportText}>
                {' '}
                This chart displays average weekly sales for the current month. Understanding weekly sales
                fluctuations will help you identify consistent trends and plan accordingly.
              </Text>
            </View>
          )}
          
          {viewMode === 'monthly' && (
            <View style={styles.descriptionCard}>
              <Text style={styles.reportTitle}>
                <Ionicons name="pie-chart-outline" size={20} color="#FF4500" /> Monthly Sales:
              </Text>
              <Text style={styles.reportText}>
                {' '}
                The chart represents quarterly sales for the year. Quarterly analysis enables you to assess
                seasonal performance and adjust strategies to boost future sales.
              </Text>
            </View>
          )}
        </View>

      </ScrollView>
      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Ionicons name="home" size={30} color="#333" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ManageInventory')}>
          <Ionicons name="clipboard-outline" size={30} color="#333" />
          <Text style={styles.navText}>Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SalesAnalytics')}>
          <Ionicons name="bar-chart-outline" size={30} color="#007aff" />
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

// Chart Configurations
const chartConfig = {
  backgroundColor: '#0004',
  backgroundGradientFrom: '#f8f8f8',
  backgroundGradientTo: '#f8f8f8',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: '2', strokeWidth: '2', stroke: '#ffa726' },
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginVertical: 5,
    borderRadius: 5,
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
  reportDescription: {
    marginVertical: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionCard: {
    borderRadius: 10,
    padding: 1,
    marginBottom: 10,
  },
  reportText: {
    fontSize: 16,
    lineHeight: 18,
    color: '#666',
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
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  viewButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#007aff',
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#005bb5',
  },
  buttonText: {
    color: '#fff',
  },
});

export default DetailedReportScreen;
