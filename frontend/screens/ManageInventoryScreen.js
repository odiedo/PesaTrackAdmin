import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ManageInventoryScreen = ({navigation}) => {
    const [inventory, setInventory] = useState([
        { id: 1, name: 'Laptop', quantity: 10, price: 25040 },
        { id: 2, name: 'Mobile Phone', quantity: 15, price: 1000 },
        { id: 3, name: 'Headphones', quantity: 20, price: 500 },
        { id: 4, name: 'Tablet', quantity: 8, price: 500  },
        { id: 5, name: 'Smartwatch', quantity: 12, price: 500  },
        { id: 6, name: 'Bluetooth Speaker', quantity: 18, price: 500  },
        { id: 7, name: 'Monitor', quantity: 5, price: 500  },
        { id: 8, name: 'Keyboard', quantity: 25, price: 500  },
        { id: 9, name: 'Mouse', quantity: 30, price: 500  },
        { id: 10, name: 'Printer', quantity: 7, price: 500  },
        { id: 11, name: 'External Hard Drive', quantity: 14, price: 500  },
        { id: 12, name: 'USB Flash Drive', quantity: 50, price: 500  },
        { id: 13, name: 'Router', quantity: 6, price: 500  },
        { id: 14, name: 'Webcam', quantity: 9, price: 500  },
        { id: 15, name: 'Projector', quantity: 4, price: 500  },
        { id: 16, name: 'Charger', quantity: 35, price: 500  },
        { id: 17, name: 'Power Bank', quantity: 22, price: 500  },
        { id: 18, name: 'Memory Card', quantity: 40, price: 500  },
        { id: 19, name: 'VR Headset', quantity: 3, price: 500  },
        { id: 20, name: 'Drone', quantity: 2, price: 500  }
      ]);      
  const [filteredInventory, setFilteredInventory] = useState(inventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleUpdateStock = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setModalVisible(true);
  };

  const handleSaveItem = () => {
    if (selectedItem) {
      // Update existing item
      setInventory(inventory.map(item => item.id === selectedItem.id ? { ...item, quantity: parseInt(newItemQuantity) } : item));
    } else {
      // Add new item
      const newItem = { id: inventory.length + 1, name: newItemName, quantity: parseInt(newItemQuantity) };
      setInventory([...inventory, newItem]);
    }
    setModalVisible(false);
    setNewItemName('');
    setNewItemQuantity('');
  };

  useEffect(() => {
    setFilteredInventory(
      inventory.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, inventory]);

  const renderInventoryItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemQuantity}>{item.quantity}</Text>
      <Text style={styles.itemQuantity}>Kshs. {item.price}</Text>
      <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdateStock(item)}>
        <Ionicons name="create-outline" size={25} color="#007bff" />
      </TouchableOpacity>
    </View>
  );

  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePagination = (direction) => {
    if (direction === 'next' && currentPage < Math.ceil(filteredInventory.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventory</Text>
      </View>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Item"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search" size={25} color="#007bff" />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.addButtonText}>Add Item</Text>
          <Ionicons name="add-circle" size={25} color="#fff" />
        </TouchableOpacity>
      {/* Inventory List */}
      <FlatList
        data={paginatedInventory}
        renderItem={renderInventoryItem}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={() =>
          filteredInventory.length > itemsPerPage && (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => handlePagination('prev')}
                disabled={currentPage === 1}
              >
                <Ionicons name="chevron-back" size={25} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.pageIndicator}>
                Page {currentPage} of {Math.ceil(filteredInventory.length / itemsPerPage)}
              </Text>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => handlePagination('next')}
                disabled={currentPage === Math.ceil(filteredInventory.length / itemsPerPage)}
              >
                <Ionicons name="chevron-forward" size={25} color="#fff" />
              </TouchableOpacity>
            </View>
          )
        }
      />

      {/* Modal for Adding / Updating Item */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedItem ? 'Update Item' : 'Add New Item'}</Text>

            {!selectedItem && (
              <TextInput
                style={styles.input}
                placeholder="Item Name"
                value={newItemName}
                onChangeText={setNewItemName}
              />
            )}

            {/* Item Quantity Input */}
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              keyboardType="numeric"
              value={newItemQuantity}
              onChangeText={setNewItemQuantity}
            />

            <View style={styles.editBox}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Dismis</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveItem}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Ionicons name="home-outline" size={30} color="#333" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ManageInventory')}>
          <Ionicons name="clipboard" size={30} color="#007aff" />
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'column',
    marginBottom: 10,
    backgroundColor: '#007bff',
    paddingTop: 40,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: '#fff',
  },
  searchBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 8,
    padding: 15,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchInput: {

  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 10,
    marginHorizontal: 10,
    width: '30%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
    borderRadius: 10,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    width: '60%',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#555',
  },
  updateButton: {
    padding: 5,
    borderRadius: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    width: '100%',
  },
  editBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    width: '40%',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    width: '40%',
    borderRadius: 8,
    marginBottom: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  paginationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
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

export default ManageInventoryScreen;
