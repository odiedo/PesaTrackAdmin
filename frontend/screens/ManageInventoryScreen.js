import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ManageInventoryScreen = ({ navigation }) => {
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [newItemQuantityInStock, setNewItemQuantityInStock] = useState('');
    const [newItemRemainingStock, setNewItemRemainingStock ] = useState('');
    const [newItemImageUrl, setNewItemImageUrl] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchInventoryData(); 
    }, []);

    // Fetch inventory data from backend API
    const fetchInventoryData = async () => {
        setLoading(true); 
        try {
            const response = await fetch('http://192.168.100.20/payment/fetch_products.php');
            const data = await response.json();
            if (response.ok && data.products) {
                setInventory(data.products);
                setFilteredInventory(data.products);
            } else {
                console.error('Error fetching inventory:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStock = (item) => {
        setSelectedItem(item);
        setNewItemName(item.name);
        setNewItemCategory(item.category);
        setNewItemPrice(item.price.toString());
        setNewItemQuantityInStock(item.quantity_in_stock.toString());
        setNewItemRemainingStock(item.remaining_stock.toString());
        setNewItemImageUrl(item.image_url);
        setModalVisible(true);
    };

    const handleAddItem = () => {
        setSelectedItem(null);
        setNewItemName('');
        setNewItemCategory('');
        setNewItemPrice('');
        setNewItemQuantityInStock('');
        setNewItemRemainingStock('');
        setNewItemImageUrl('');
        setModalVisible(true);
    };

    const handleSaveItem = async () => {
        if (!newItemName || !newItemCategory || !newItemPrice || !newItemQuantityInStock || !newItemRemainingStock || !newItemImageUrl) {
            alert('Please fill in all fields');
            return;
        }
    
        const itemData = {
            id: selectedItem?.id, 
            name: newItemName,
            category: newItemCategory,
            price: parseFloat(newItemPrice),
            quantity_in_stock: parseInt(newItemQuantityInStock),
            remaining_stock: parseInt(newItemRemainingStock),
            image_url: newItemImageUrl,
        };
    
        setLoading(true);
    
        try {
            const response = await fetch(selectedItem ? 'http://192.168.100.20/payment/admin/update_product.php' : 'http://192.168.100.20/payment/admin/add_products.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData),
            });
    
            const responseText = await response.text(); // Get raw response body
            console.log('Raw response:', responseText); // Log raw response
    
            // Now try parsing the response
            const result = JSON.parse(responseText);
    
            if (response.ok) {
                if (selectedItem) {
                    // Update existing item
                    setInventory(inventory.map(item => (item.id === selectedItem.id ? { ...itemData, id: selectedItem.id } : item)));
                    setFilteredInventory(filteredInventory.map(item => (item.id === selectedItem.id ? { ...itemData, id: selectedItem.id } : item)));
                    alert('Item updated successfully');
                } else {
                    // Add new item
                    setInventory([...inventory, { ...itemData, id: result.id }]);
                    setFilteredInventory([...filteredInventory, { ...itemData, id: result.id }]);
                    alert('Item added successfully');
                }
            } else {
                console.error('Error:', result.error);
                alert(result.error || 'Failed to save item');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving the item');
        } finally {
            setLoading(false); 
            setModalVisible(false); 
            resetForm();
        }
    };
    

    const resetForm = () => {
        setNewItemName('');
        setNewItemCategory('');
        setNewItemPrice('');
        setNewItemQuantityInStock('');
        setNewItemRemainingStock('');
        setNewItemImageUrl('');
    };

    useEffect(() => {
        setFilteredInventory(
            inventory.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, inventory]);

    const renderInventoryItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>{item.quantity_in_stock}</Text>
            <Text style={styles.itemPrice}> {item.price}</Text>
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

            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
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
            )}

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
                        <TextInput
                          style={styles.input}
                          placeholder="Item Name"
                          value={newItemName}
                          onChangeText={setNewItemName}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Category"
                            value={newItemCategory}
                            onChangeText={setNewItemCategory}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Price"
                            keyboardType="numeric"
                            value={newItemPrice}
                            onChangeText={setNewItemPrice}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Quantity in Stock"
                            keyboardType="numeric"
                            value={newItemQuantityInStock}
                            onChangeText={setNewItemQuantityInStock}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Remaining Stock"
                            keyboardType="numeric"
                            value={newItemRemainingStock}
                            onChangeText={setNewItemRemainingStock}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Image URL"
                            value={newItemImageUrl}
                            onChangeText={setNewItemImageUrl}
                        />

                        <View style={styles.editBox}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Dismiss</Text>
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
