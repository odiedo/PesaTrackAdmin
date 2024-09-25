import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icons
import DateTimePicker from '@react-native-community/datetimepicker';

const UserPermissionsScreen = ({navigation}) => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', permission: 'Admin', autoLogout: true, logoutTime: '18:30', status: 'Active' },
    { id: 2, name: 'Jane Smith', permission: 'Editor', autoLogout: true, logoutTime: '18:30', status: 'Active' },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newUserPermission, setNewUserPermission] = useState('Viewer');
  const [newLogoutTime, setNewLogoutTime] = useState(new Date());
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(true);
  const [dormantReason, setDormantReason] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [statusOptions, setStatusOptions] = useState(['Sick', 'Leave', 'Suspension', 'Fired']);

  const handleUpdatePermissions = (user) => {
    setSelectedUser(user);
    setNewLogoutTime(new Date(`1970-01-01T${user.logoutTime}:00`));
    setAutoLogoutEnabled(user.autoLogout);
    setModalVisible(true);
  };

  const handleSaveUser = () => {
    setUsers(users.map(user =>
      user.id === selectedUser.id
        ? { ...user, permission: newUserPermission, autoLogout: autoLogoutEnabled, logoutTime: newLogoutTime.toTimeString().substring(0, 5), status: dormantReason || user.status }
        : user
    ));
    setModalVisible(false);
  };

  const handleRemoveUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleSetDormant = (userId) => {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      const updatedUsers = [...users];
      updatedUsers[userIndex].status = 'Dormant';
      setUsers(updatedUsers);
    }
  };

  const handleChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewLogoutTime(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>User Permissions</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.userAdd}>Add Action</Text>
        <Ionicons name="add-circle" size={25} color="#fff" />
      </TouchableOpacity>
      {/* Scrollable User List */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {users.map((user) => (
          <View key={user.id} style={styles.item}>
            <View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userPermission}>
                Permission: {user.permission}
              </Text>
              {user.autoLogout && (
                <Text style={styles.logoutTime}>
                  Auto-Logout at: {user.logoutTime}
                </Text>
              )}
              <Text style={styles.userStatus}>Status: {user.status}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleUpdatePermissions(user)}
              >
                <Ionicons name="create-outline" size={28} color="green" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleRemoveUser(user.id)}
              >
                <Ionicons name="trash-outline" size={28} color="red" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleSetDormant(user.id)}
              >
                <Ionicons name="pause-circle-outline" size={28} color="#ffcc00" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Ionicons name="home-outline" size={30} color="#333" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ManageInventory')}>
          <Ionicons name="clipboard-outline" size={30} color="#333" />
          <Text style={styles.navText}>Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SalesAnalytics')}>
          <Ionicons name="bar-chart-outline" size={30} color="#333" />
          <Text style={styles.navText}>Sales</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings" size={30} color="#007aff" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
  
      {/* Modal for Adding/Updating User */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Action</Text>
  
            {/* Permission Input */}
            <TextInput
              style={styles.input}
              placeholder="Permission (Admin, Editor, Viewer)"
              value={newUserPermission}
              onChangeText={setNewUserPermission}
            />
  
            {/* Auto-Logout Switch */}
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Enable Auto-Logout</Text>
              <Switch
                value={autoLogoutEnabled}
                onValueChange={setAutoLogoutEnabled}
              />
            </View>
  
            {/* Logout Time Input */}
            {autoLogoutEnabled && (
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.logoutTimeInput}>
                  Logout Time: {newLogoutTime.toTimeString().substring(0, 5)}
                </Text>
              </TouchableOpacity>
            )}
            {showDatePicker && (
              <DateTimePicker
                mode="time"
                value={newLogoutTime}
                onChange={handleChangeDate}
              />
            )}
  
            {/* Dormant Reason Input */}
            <TextInput
              style={styles.input}
              placeholder="Dormant Reason (Sick, Leave, Suspension, Fired)"
              value={dormantReason}
              onChangeText={setDormantReason}
            />
  
            {/* Save and Cancel Buttons */}
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveUser}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 10,
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
  addButton: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: '#007bff',
    width: '35%',
    marginLeft: '60%',
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,    
    justifyContent: 'space-between',
  },
  userAdd: {
    fontWeight: '900',
    color: '#fff',
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  userPermission: {
    fontSize: 16,
    color: '#555',
  },
  logoutTime: {
    fontSize: 14,
    color: '#888',
  },
  userStatus: {
    fontSize: 14,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginHorizontal: 8,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#555',
  },
  logoutTimeInput: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
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


export default UserPermissionsScreen;
