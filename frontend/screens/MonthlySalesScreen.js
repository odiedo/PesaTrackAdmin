import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker'; 

const screenWidth = Dimensions.get('window').width;

const MonthlySalesScreen = () => {
  const [weekData, setWeekData] = useState([
    {
      week: 'Week 1',
      sales: [
        { day: '1st', amount: 1000 },
        { day: '2nd', amount: 1200 },
        { day: '3rd', amount: 1400 },
        { day: '4th', amount: 1600 },
        { day: '5th', amount: 1500 },
        { day: '6th', amount: 1700 },
        { day: '7th', amount: 1300 },
      ],
    },
    {
      week: 'Week 2',
      sales: [
        { day: '8th', amount: 1100 },
        { day: '9th', amount: 1150 },
        { day: '10th', amount: 900 },
        { day: '11th', amount: 1050 },
        { day: '12th', amount: 1200 },
        { day: '13th', amount: 1350 },
        { day: '14th', amount: 1500 },
      ],
    },
    {
      week: 'Week 3',
      sales: [
        { day: '15th', amount: 1600 },
        { day: '16th', amount: 1400 },
        { day: '17th', amount: 1800 },
        { day: '18th', amount: 1600 },
        { day: '19th', amount: 1400 },
        { day: '20th', amount: 2000 },
        { day: '21st', amount: 1700 },
      ],
    },
    {
      week: 'Week 4',
      sales: [
        { day: '22nd', amount: 1800 },
        { day: '23rd', amount: 1700 },
        { day: '24th', amount: 1600 },
        { day: '25th', amount: 1500 },
        { day: '26th', amount: 1300 },
        { day: '27th', amount: 1200 },
        { day: '28th', amount: 1100 },
      ],
    },
  ]);

  const [selectedMonth, setSelectedMonth] = useState('September');
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // Aggregate weekly data for BarChart
  const weeklySalesTotals = weekData.map(week =>
    week.sales.reduce((total, sale) => total + sale.amount, 0)
  );

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
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
        >
          <Picker.Item label="September" value="September" />
          <Picker.Item label="August" value="August" />
          <Picker.Item label="July" value="July" />
          {/* Add more months as needed */}
        </Picker>
      </View>

      {/* Title */}
      <Text style={styles.title}>Monthly Sales for {selectedMonth}</Text>

      {/* BarChart for weekly sales */}
      <BarChart
        data={{
          labels: weekData.map(week => week.week),
          datasets: [
            {
              data: weeklySalesTotals,
            },
          ],
        }}
        width={screenWidth - 40} // Adjust for padding
        height={250}
        yAxisLabel="Kshs "
        chartConfig={{
          backgroundColor: '#f8f8f8',
          backgroundGradientFrom: '#f8f8f8',
          backgroundGradientTo: '#f8f8f8',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
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
          <Text style={styles.weekAmount}>Kshs {weeklySalesTotals[index].toLocaleString()}</Text>
        </TouchableOpacity>
      ))}

      {/* Modal for showing selected week's day-wise sales */}
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
                    <Text style={styles.amount}>Kshs {sale.amount.toLocaleString()}</Text>
                  </View>
                ))}
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
    color: '#28a745',
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
});

export default MonthlySalesScreen;
