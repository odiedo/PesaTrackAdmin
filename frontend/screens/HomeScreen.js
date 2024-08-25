import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { CartContext } from './CartContext'; 
import { getProductsFromJson, syncProducts } from '../api';

export default function HomeScreen({ navigation }) {
  const { cart, addToCart, resetCart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [groceriesData, setGroceriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await getProductsFromJson();
      if (data && Array.isArray(data.products)) {
        setGroceriesData(data.products);
      } else {
        console.error('Unexpected response format:', data);
        setGroceriesData([]);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setGroceriesData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredGroceries = groceriesData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorizedProducts = filteredGroceries.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    if (acc[product.category].length < 10) {
      acc[product.category].push(product);
    }
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <View style={styles.headerMain}>
        <Text style={styles.header}>PesaTrack</Text>
        <Text style={styles.subtitle}>Your one-stop shop for all products!</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#000"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.syncButton}
            onPress={async () => {
              await syncProducts();
              // Re-fetch products after syncing
              fetchProducts();
            }}
          >
            <Icon name="sync" size={24} color="#fff" />
            <Text style={styles.syncButtonText}>Sync Products</Text>
          </TouchableOpacity>
        </View>

      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : (
        <ScrollView style={styles.itemsBody}>
          {Object.keys(categorizedProducts).map((category, index) => (
            <View key={index} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <FlatList
                data={categorizedProducts[category]}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.shopItem}>
                    <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.groceryImage} />
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
            </View>
          ))}
        </ScrollView>
      )}

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
    paddingTop: 50,
    backgroundColor: '#007BFF',
    width: '100%',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#ffeefe',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  syncButtonText: {
    color: '#fff',
    marginLeft: 10,
  },  
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  itemsBody: {
    padding: 20,
  },
  shopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 1,
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
    backgroundColor: '#0004',
  },
});
