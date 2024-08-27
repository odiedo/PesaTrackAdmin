import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import axios from 'axios';

const RecentSalesScreen = () => {
  const [recentSales, setRecentSales] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [salesDetails, setSalesDetails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchRecentSales();
  }, []);

  const fetchRecentSales = async () => {
    try {
      const response = await axios.get('http://192.168.100.20:5000/recent-sales');
      setRecentSales(response.data);
    } catch (error) {
      console.error('Failed to fetch recent sales:', error);
    }
  };

  const fetchSalesDetails = async (customerNumber) => {
    try {
      const response = await axios.get(`http://192.168.100.20:5000/sales-details/${customerNumber}`);
      setSalesDetails(response.data);
      setSelectedCustomer(customerNumber);
      setModalVisible(true);
    } catch (error) {
      console.error('Failed to fetch sales details:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => fetchSalesDetails(item.customer_number)}>
      <View style={styles.itemContainer}>
        <Text style={styles.customerText}>{item.customer_number}</Text>
        <Text style={styles.itemText}>Total Items: {item.total_items}</Text>
        <Text style={styles.itemText}>Total Amount: Kshs. {item.total_amount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={recentSales}
        renderItem={renderItem}
        keyExtractor={(item) => item.customer_number}
        contentContainerStyle={styles.listContent}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedCustomer}</Text>
            <FlatList
              data={salesDetails}
              renderItem={({ item }) => (
                <View style={styles.modalItemContainer}>
                  <Text style={styles.modalItemText}>Product: {item.product_name}</Text>
                  <Text style={styles.modalItemText}>Quantity: {item.quantity}</Text>
                  <Text style={styles.modalItemText}>Price: Kshs. {item.price}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.modalListContent}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  customerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalItemContainer: {
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 14,
    color: '#555',
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RecentSalesScreen;
