// OrderHistoryScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function OrderHistoryScreen() {
  const orders = [
    { id: '1', date: '2024-08-20', total: 50 },
    // Add more orders here
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text>Order Date: {item.date}</Text>
            <Text>Total: ${item.total}</Text>
            <Button title="View Details" onPress={() => {/* View details logic */}} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  orderItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});
