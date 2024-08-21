import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const groceriesData = [
    { id: '1', name: 'Coconut', price: 'Kshs. 30', image: 'https://cdn.selinawamucii.com/wp-content/uploads/2016/04/selinawamucii-product-17.jpg' },
    { id: '2', name: 'Mangoes', price: 'Kshs. 50', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Hapus_Mango.jpg/1024px-Hapus_Mango.jpg' },
    { id: '3', name: 'Pawpaw (Papaya)', price: 'Kshs. 40', image: 'https://www.fmk.co.ke/wp-content/uploads/2021/09/pawpaw-local.jpeg' },
    { id: '4', name: 'Passion Fruit', price: 'Kshs. 25', image: 'https://farmbizafrica.com/wp-content/uploads/2018/10/Purple-Passion-Fruit-Variety.png' },
    { id: '5', name: 'Bananas', price: 'Kshs. 30', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/1024px-Banana-Single.jpg' },
    { id: '6', name: 'Pineapples', price: 'Kshs. 60', image: 'https://www.dukachapchap.co.ke/wp-content/uploads/2019/02/pineapple.jpg' },
    { id: '7', name: 'Cassava', price: 'Kshs. 20', image: 'https://cdn.standardmedia.co.ke/images/wysiwyg/images/hQdJjVdFaDAgnTxfxXAW9Cu0iUehHRRI2oZacFUM.jpg' },
    { id: '8', name: 'Sweet Potatoes', price: 'Kshs. 50', image: 'https://kenyacurrent.com/wp-content/uploads/2016/09/sweet-potatoes.jpg' },
    { id: '9', name: 'Arrowroots (Nduma)', price: 'Kshs. 80', image: 'https://cdn.selinawamucii.com/wp-content/uploads/2017/06/selinawamucii-product-4.jpg' },
    { id: '10', name: 'Oranges', price: 'Kshs. 30', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Orange-Fruit-Pieces.jpg/1024px-Orange-Fruit-Pieces.jpg' },
    { id: '11', name: 'Limes', price: 'Kshs. 10', image: 'https://www.oxfarmorganic.com/wp-content/uploads/2020/06/benefits-of-lime-240x172.jpg' },
    { id: '12', name: 'Tomatoes', price: 'Kshs. 40', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bright_red_tomato_and_cross_section02.jpg/1024px-Bright_red_tomato_and_cross_section02.jpg' },
    { id: '13', name: 'Onions', price: 'Kshs. 50', image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhFqtqf_7YMalev8C8lmCSdm4ZtvYK2cEeBKaRopEt-YMUjRoUBTKhdM2BZXerivJjwKNrSAC5Fz89-59GVAPIIUrDPqJ5SiUK61wGqF-o8G91Y4_25dxI96la-YdIKdv-vZBEOkr6iRC8m/s1600/Onion.jpg' },
    { id: '14', name: 'Ginger', price: 'Kshs. 80', image: 'https://cdn.standardmedia.co.ke/images/friday/sbocrq6cvyfolgtuh56b501153a30d.jpg' },
    { id: '15', name: 'Garlic', price: 'Kshs. 100', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJsGfgUtmiSCd8e_pLSuAfIRNoTTWmqGAVlA&s' },
    { id: '16', name: 'Green Beans (Mishiri)', price: 'Kshs. 70', image: 'https://greenspoon.co.ke/wp-content/uploads/2022/03/Greenspoon-Kenya-French-Beans.jpg' },
    { id: '17', name: 'Eggplants (Brinjals)', price: 'Kshs. 40', image: 'https://www.shutterstock.com/image-photo/eggplant-aubergine-egpplant-slices-leaves-260nw-11308981.jpg' },
    { id: '18', name: 'Kales (Sukuma Wiki)', price: 'Kshs. 20', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Collard-Greens-Bundle.jpg/220px-Collard-Greens-Bundle.jpg' },
    { id: '19', name: 'Spinach', price: 'Kshs. 20', image: 'https://blog.dmrckenya.co.ke/wp-content/uploads/2020/06/spinach-in-kenya.jpg' },
    { id: '20', name: 'Okra', price: 'Kshs. 60', image: 'https://www.malindikenya.net/images/uploads/articoli/5346_l.jpg' },
];
  
  

export default function HomeScreen({ navigation }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const resetCart = () => {
    setCart([]);
  };
  const filteredGroceries = groceriesData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <View style={styles.groceryItem}>
                <Image source={{ uri: item.image }} style={styles.groceryImage} />
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
                <Text style={styles.cartButtonText}></Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.cartButton}
                onPress={() => navigation.navigate('Cart', { cart, resetCart })}
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
    marginHorizontal: 0,
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
    backgroundColor: '#0005',
  },
});