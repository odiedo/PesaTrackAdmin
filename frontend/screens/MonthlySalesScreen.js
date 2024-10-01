import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';

const screenWidth = Dimensions.get('window').width;

const MonthlySalesScreen = () => {
  const [weekData, setWeekData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [weeklySalesTotals, setWeeklySalesTotals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the current month name
  const getCurrentMonth = () => {
    const currentDate = new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[currentDate.getMonth()];
  };

  // Fetch sales data for the selected month
  const fetchSalesData = async (month) => {
    try {
      const response = await fetch(`http://192.168.100.20/payment/admin/monthly_sales.php?month=${month}`);
      const data = await response.json();
      setWeekData(data.weekly_sales || []);
      setWeeklySalesTotals(data.weekly_totals || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentMonth = getCurrentMonth();
    setSelectedMonth(currentMonth);
    fetchSalesData(currentMonth);
  }, []);

  const handleWeekClick = (week) => {
    setSelectedWeek(week);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Month Picker */}
      <View style={styles.header}>
        <Text style={styles.adminText}>Admin Panel</Text>
        <Picker
          selectedValue={selectedMonth}
          style={styles.monthPicker}
          onValueChange={(itemValue) => {
            setSelectedMonth(itemValue);
            setLoading(true);
            fetchSalesData(itemValue);
          }}
        >
          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
            <Picker.Item label={month} value={month} key={month} />
          ))}
        </Picker>
      </View>

      <Text style={styles.title}>Monthly Sales for {selectedMonth}</Text>

      {!loading ? (
        <>
          {/* BarChart for weekly sales */}
          <BarChart
            data={{
              labels: weekData.map(week => week.week),
              datasets: [
                {
                  data: weeklySalesTotals.map(total => total || 0),
                },
              ],
            }}
            width={screenWidth - 40}
            height={250}
            yAxisLabel="Kshs "
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              barPercentage: 0.6,
            }}
            verticalLabelRotation={30}
            fromZero
            style={{ borderRadius: 16, marginBottom: 20 }}
          />

          {/* List of weeks */}
          {weekData.map((week, index) => (
            <TouchableOpacity
              key={index}
              style={styles.weekItem}
              onPress={() => handleWeekClick(week)}
            >
              <Text style={styles.weekText}>{week.week}</Text>
              <Text style={styles.weekAmount}>
                Kshs {weeklySalesTotals[index]?.toLocaleString() || '0'}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Modal for selected week's day-wise sales */}
          {selectedWeek && (
            <Modal
              visible={isModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{selectedWeek.week} Sales Breakdown</Text>
                  <ScrollView>
                    {selectedWeek.sales.map((sale, index) => (
                      <View key={index} style={styles.modalItem}>
                        <Text style={styles.day}>{sale.day}</Text>
                        <Text style={styles.amount}>
                          Kshs {sale.amount?.toLocaleString() || '0'}
                        </Text>
                      </View>
                    ))}
                    <View style={styles.modalItem}>
                      <Text style={styles.totalLabel}>Total: </Text>
                      <Text style={styles.totalAmount}>
                        Kshs {selectedWeek.total?.toLocaleString() || '0'}
                      </Text>
                    </View>
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
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
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  adminText: {
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
  },
  monthPicker: {
    height: 50,
    width: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  weekItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  weekText: {
    fontSize: 18,
    fontWeight: '600',
  },
  weekAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007bff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  day: {
    fontSize: 16,
    color: '#555',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#007bff',
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#007bff',
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
});

export default MonthlySalesScreen;
