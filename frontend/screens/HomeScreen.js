import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { getProducts } from '../api';
import { CartContext } from './CartContext'; 

export default function HomeScreen({ navigation }) {
  const { cart, addToCart, resetCart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [groceriesData, setGroceriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        console.log('API Response:', response);
        if (response && Array.isArray(response.products)) {
          setGroceriesData(response.products);
        } else {
          console.error('Unexpected response format:', response);
          setGroceriesData([]);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setGroceriesData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredGroceries = groceriesData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerMain}>
        <Text style={styles.header}>PesaTrack</Text>
        <Text style={styles.subtitle}>Your one-stop shop for all products!</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#ffeefe"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <FlatList
        data={filteredGroceries}
        style={styles.itemsBody}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.groceryItem}>
            <Image source={{ uri: item.image_url }} style={styles.groceryImage} />
            <View style={styles.groceryDetails}>
              <Text style={styles.groceryName}>{item.name}</Text>
              <Text style={styles.groceryPrice}>{item.price}</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
              <Icon name="add-shopping-cart" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.cartButton, styles.resetButton]}
          onPress={resetCart}
        >
          <Icon name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Icon name="shopping-cart" size={24} color="#fff" />
          <Text style={styles.cartButtonText}>View Cart ({cart.length})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerMain: {
    paddingTop: 40,
    backgroundColor: '#007BFF',
    width: '100%',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#ffeefe',
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    color: '#ffeefe',
  },
  itemsBody: {
    padding: 20,
  },
  groceryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  groceryImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  groceryDetails: {
    flex: 1,
  },
  groceryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  groceryPrice: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  cartButton: { 
    backgroundColor: '#007BFF',
    padding: 15,
    marginHorizontal: 2,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cartButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#FF6347',
  },
});
