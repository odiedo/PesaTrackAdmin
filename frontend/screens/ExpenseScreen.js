import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const ExpensesScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([
    { id: '1', title: 'Office Supplies', amount: 3000, date: '2024-09-15', category: 'Office' },
    { id: '2', title: 'Transport', amount: 2000, date: '2024-09-14', category: 'Logistics' },
    { id: '3', title: 'Utility Bills', amount: 5000, date: '2024-09-13', category: 'Utilities' },
    { id: '4', title: 'Marketing', amount: 1500, date: '2024-09-12', category: 'Marketing' },
    { id: '5', title: 'Inventory Purchase', amount: 150000, date: '2024-09-11', category: 'Inventory' },
    { id: '6', title: 'Advertising', amount: 8000, date: '2024-09-10', category: 'Marketing' },
    { id: '7', title: 'Rent', amount: 25000, date: '2024-09-09', category: 'Rent' },
    { id: '8', title: 'Salaries', amount: 50000, date: '2024-09-08', category: 'Payroll' },
    { id: '9', title: 'Electricity Bill', amount: 4000, date: '2024-09-07', category: 'Utilities' },
    { id: '10', title: 'Internet Subscription', amount: 3000, date: '2024-09-06', category: 'Utilities' },
    { id: '11', title: 'Equipment Maintenance', amount: 6000, date: '2024-09-05', category: 'Maintenance' },
    { id: '12', title: 'Software License', amount: 12000, date: '2024-09-04', category: 'IT Expenses' },
    { id: '13', title: 'Packaging Materials', amount: 5000, date: '2024-09-03', category: 'Supplies' },
    { id: '14', title: 'Training Programs', amount: 10000, date: '2024-09-02', category: 'Training' },
    { id: '15', title: 'Delivery Expenses', amount: 4500, date: '2024-09-01', category: 'Logistics' },
    { id: '16', title: 'Website Hosting', amount: 7000, date: '2024-08-31', category: 'IT Expenses' },
    { id: '17', title: 'Security Services', amount: 15000, date: '2024-08-30', category: 'Security' },
    { id: '18', title: 'Furniture', amount: 20000, date: '2024-08-29', category: 'Office' },
    { id: '19', title: 'Stationery', amount: 3000, date: '2024-08-28', category: 'Supplies' },
    { id: '20', title: 'Insurance', amount: 12000, date: '2024-08-27', category: 'Insurance' },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: '', date: new Date() });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const expensesPerPage = 10;

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewExpense({ ...newExpense, date: selectedDate });
    }
  };

  const handleAddExpense = () => {
    if (newExpense.title && newExpense.amount && newExpense.category) {
      const expense = {
        id: Math.random().toString(),
        title: newExpense.title,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date.toISOString().slice(0, 10),
      };
      setExpenses((prevExpenses) => [...prevExpenses, expense]);
      setNewExpense({ title: '', amount: '', category: '', date: new Date() });
      setIsModalVisible(false);
    }
  };

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseCard}>
      <View style={styles.expenseCardHeader}>
        <Ionicons name="pricetag-outline" size={24} color="#333" />
        <Text style={styles.expenseTitle}>{item.title}</Text>
      </View>
      <View style={styles.expenseDetails}>
        <Text style={styles.expenseAmount}>Kshs. {item.amount}</Text>
        <Text style={styles.expenseCategory}>{item.category}</Text>
        <Text style={styles.expenseDate}>{item.date}</Text>
      </View>
    </View>
  );

  const totalPages = Math.ceil(expenses.length / expensesPerPage);
  const currentExpenses = expenses.slice((currentPage - 1) * expensesPerPage, currentPage * expensesPerPage);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Expenses</Text>
        <Ionicons name="receipt-outline" size={28} color="#fff" />
      </View>

      {/* Add Expense Button */}
      <TouchableOpacity style={styles.addExpenseButton} onPress={() => setIsModalVisible(true)}>
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.addExpenseText}>Add New Expense</Text>
      </TouchableOpacity>

      {/* Expenses List */}
      <FlatList
        data={currentExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        style={styles.expensesList}
      />
    <View style={styles.pagination}>
        <TouchableOpacity
            style={styles.paginationButton}
            onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}
        >
            <Ionicons name="chevron-back" size={25} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>
            <Text style={styles.pageIndicator}>Page {currentPage} of {totalPages}</Text>
        </Text>
        <TouchableOpacity
            style={styles.paginationButton}
            onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}
        >
            <Ionicons name="chevron-forward" size={25} color="#fff" />
        </TouchableOpacity>
    </View>
      {/* Add Expense Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Expense</Text>

            <TextInput
              style={styles.input}
              placeholder="Expense Title"
              value={newExpense.title}
              onChangeText={(text) => setNewExpense({ ...newExpense, title: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={newExpense.amount}
              onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Category"
              value={newExpense.category}
              onChangeText={(text) => setNewExpense({ ...newExpense, category: text })}
            />

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.input}>Date: {newExpense.date.toISOString().slice(0, 10)}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={newExpense.date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={24} color="red" />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
                <Ionicons name="checkmark-circle-outline" size={24} color="green" />
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f0f5',
    },
    header: {
      padding: 20,
      paddingTop: 40,
      backgroundColor: '#007aff',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    addExpenseButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 15,
      backgroundColor: '#007aff',
      borderRadius: 8,
      marginHorizontal: 10,
      marginVertical: 10,
    },
    addExpenseText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 5,
    },
    expensesList: {
      flexGrow: 1,
      paddingHorizontal: 10,
    },
    expenseCard: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 8,
      marginVertical: 5,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    expenseCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    expenseTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
      color: '#333',
    },
    expenseDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    expenseAmount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#007aff',
    },
    expenseCategory: {
      fontSize: 14,
      color: '#333',
    },
    expenseDate: {
      fontSize: 12,
      color: '#666',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginVertical: 10,
      fontSize: 16,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    cancelButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 5,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      marginLeft: 5,
      fontSize: 16,
      fontWeight: 'bold',
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
  });

export default ExpensesScreen;
