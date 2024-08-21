import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, TextInput, Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function CartScreen({ route, navigation }) {
    const {cart, resetCart} = route.params;
    const [cartItems, setCartItems] = useState(cart);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [modalStep, setModalStep] = useState(1); 
    const [amountReceived, setAmountReceived] = useState('');
    const [balance, setBalance] = useState(null);
    const [successMessageVisible, setSuccessMessageVisible] = useState(false);

    // Increment quantity of an item in the cart
    const incrementQuantity = (item) => {
      const updatedCartItems = cartItems.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 } : cartItem
      );
      setCartItems(updatedCartItems);
    };
  
    // Decrement quantity of an item in the cart
    const decrementQuantity = (item) => {
      const updatedCartItems = cartItems.map(cartItem =>
        cartItem.id === item.id && (cartItem.quantity || 1) > 1
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
      setCartItems(updatedCartItems);
    };
  
    // Remove an item from the cart
    const removeItem = (item) => {
      const updatedCartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
      setCartItems(updatedCartItems);
    };
    const getTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price.replace('Kshs. ', '') * (item.quantity || 1)), 0);
    };

    const handlePayWithCash = () => {
        setModalStep(2);
    };

    const handleAmountReceivedChange = (amount) => {
        setAmountReceived(amount);
        const total = getTotal();
        if (parseFloat(amount) >= total) {
            setBalance(parseFloat(amount) - total);
        } else {
            setBalance(null);
        }
    };

    const handleCompletePurchase = () => {
        setPaymentModalVisible(false);
        setSuccessMessageVisible(true);
        resetCart();

        setTimeout(() => {
            setSuccessMessageVisible(false);
            navigation.navigate('Home');
        }, 2000);
    };

    return (
        <View style={styles.container}>
        <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <View style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemPrice}>{item.price}</Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => decrementQuantity(item)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity || 1}</Text>
                    <TouchableOpacity onPress={() => incrementQuantity(item)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                </View>
                <TouchableOpacity onPress={() => removeItem(item)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>X</Text>
                </TouchableOpacity>
            </View>
            )}
        />
        <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: Kshs. {getTotal()}</Text>
            <TouchableOpacity style={styles.checkoutButton} onPress={() => setPaymentModalVisible(true)}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
        </View>

        {/* Progressive Modal */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={paymentModalVisible}
            onRequestClose={() => setPaymentModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.paymentModalContent}>
                    {modalStep === 1 && (
                        <>
                            <Text style={styles.summaryText}>Checkout Summary</Text>
                            <FlatList
                                data={cartItems}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={styles.summaryItem}>
                                        <Text style={styles.summaryItemText}>{item.name} x {item.quantity || 1}</Text>
                                        <Text style={styles.summaryItemText}>{item.price}</Text>
                                    </View>
                                )}
                            />
                            <Text style={styles.summaryTotalText}>Total: Kshs. {getTotal()}</Text>
                            <TouchableOpacity style={styles.paymentButton} onPress={handlePayWithCash}>
                                <Text style={styles.paymentButtonText}>Pay with Cash</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {modalStep === 2 && (
                        <>
                            <Text style={styles.modalTitle}>Enter Amount Received</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Amount Received"
                                keyboardType="numeric"
                                value={amountReceived}
                                onChangeText={handleAmountReceivedChange}
                            />
                            {balance !== null && (
                                <Text style={styles.balanceText}>Balance: Kshs. {balance}</Text>
                            )}
                            <TouchableOpacity
                                style={styles.completeButton}
                                onPress={handleCompletePurchase}
                                disabled={parseFloat(amountReceived) < getTotal()}
                            >
                                <Text style={styles.completeButtonText}>Complete Purchase</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>

        {/* Success Message Modal */}
        {successMessageVisible && (
            <Modal
                animationType="fade"
                transparent={true}
                visible={successMessageVisible}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.successModalContent}>
                        <Text style={styles.successText}>Purchase Complete!</Text>
                    </View>
                </View>
            </Modal>
        )}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 5,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  removeButton: {
    marginLeft: 10,
  },
  removeButtonText: {
    fontSize: 18,
    color: '#ff0000',
    paddingHorizontal: 10,
  },
  totalContainer: {
    marginTop: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  paymentModalContent: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryItemText: {
    fontSize: 16,
  },
  summaryTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'right',
  },
  paymentButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContent: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  balanceText: {
    fontSize: 16,
    marginBottom: 20,
  },
  completeButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  successModalContent: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28A745',
  },
});
