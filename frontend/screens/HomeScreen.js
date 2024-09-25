import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { Icon } from 'react-native-elements';

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy inventory data
  const inventoryData = [
    { id: 1, name: 'Apple iPhone 14', price: '999', image: 'https://dummyimage.com/60x60/000/fff' },
    { id: 2, name: 'MacBook Pro 16"', price: '2499', image: 'https://dummyimage.com/60x60/000/fff' },
    { id: 3, name: 'AirPods Pro', price: '249', image: 'https://dummyimage.com/60x60/000/fff' },
  ];

  // Dummy sales report data
  const salesReport = [
    { date: '2024-09-01', totalSales: '5000' },
    { date: '2024-09-02', totalSales: '6200' },
    { date: '2024-09-03', totalSales: '7100' },
  ];

  // Dummy user management data
  const users = [
    { name: 'John Doe', role: 'Admin' },
    { name: 'Jane Smith', role: 'Cashier' },
    { name: 'Michael Brown', role: 'Manager' },
  ];

  // Filtered inventory data
  const filteredInventory = inventoryData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerMain}>
        <Text style={styles.header}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Manage Inventory, Sales, and Users</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search inventory..."
            placeholderTextColor="#000"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.dashboardBody}>
        {/* Inventory Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventory Management</Text>
          <FlatList
            data={filteredInventory}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.inventoryItem}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>${item.price}</Text>
                </View>
              </View>
            )}
          />
        </View>

        {/* Sales Report */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sales Report</Text>
          {salesReport.map((report, index) => (
            <View key={index} style={styles.reportItem}>
              <Text style={styles.reportText}>
                {report.date}: ${report.totalSales} in sales
              </Text>
            </View>
          ))}
        </View>

        {/* User Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Management</Text>
          {users.map((user, index) => (
            <View key={index} style={styles.userItem}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userRole}>{user.role}</Text>
              <TouchableOpacity
                style={styles.userActionButton}
                onPress={() => Alert.alert('User Action', `Manage ${user.name}`)}
              >
                <Text style={styles.userActionText}>Manage</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#fff" />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="bar-chart" size={24} color="#fff" />
          <Text style={styles.navText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="inventory" size={24} color="#fff" />
          <Text style={styles.navText}>Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="people" size={24} color="#fff" />
          <Text style={styles.navText}>Users</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerMain: {
    paddingTop: 50,
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  dashboardBody: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
  },
  reportItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  reportText: {
    fontSize: 14,
    color: '#333',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    flex: 1,
    fontSize: 16,
  },
  userRole: {
    fontSize: 14,
    color: '#666',
  },
  userActionButton: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5,
  },
  userActionText: {
    color: '#fff',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
});
