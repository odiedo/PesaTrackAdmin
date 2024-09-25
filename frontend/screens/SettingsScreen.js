import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  const [isTaxEnabled, setIsTaxEnabled] = useState(true);
  const [taxRate, setTaxRate] = useState('16');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleToggleTax = () => setIsTaxEnabled(previousState => !previousState);

  const openModal = (option) => {
    setSelectedOption(option);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOption('');
  };

  const saveChanges = () => {
    console.log('Changes saved:', { userName, userEmail, password });
    closeModal();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* User Management */}
        <Text style={styles.sectionTitle}>User Management</Text>
        <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('UserPermissions')}>
          <Text style={styles.optionText}>Manage Users</Text>
          <Ionicons name="people-outline" size={20} color="#333" />
        </TouchableOpacity>
        
        {/* System Settings */}
        <Text style={styles.sectionTitle}>System Settings</Text>
        <View style={styles.optionItem}>
          <Text style={styles.optionText}>Enable Tax</Text>
          <Switch
            trackColor={{ false: '#d3d3d3', true: '#007aff' }}
            thumbColor={isTaxEnabled ? '#fff' : '#fff'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleToggleTax}
            value={isTaxEnabled}
          />
        </View>
        {isTaxEnabled && (
          <View style={styles.optionItem}>
            <Text style={styles.optionText}>Tax Rate (%)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={taxRate}
              onChangeText={setTaxRate}
            />
          </View>
        )}
        <TouchableOpacity style={styles.optionItem} onPress={() => openModal('currency')}>
          <Text style={styles.optionText}>Currency</Text>
          <Text style={styles.optionValue}>KSH</Text>
          <Ionicons name="cash-outline" size={20} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={() => openModal('businessInfo')}>
          <Text style={styles.optionText}>Business Information</Text>
          <Ionicons name="information-circle-outline" size={20} color="#333" />
        </TouchableOpacity>

        {/* Security Settings */}
        <Text style={styles.sectionTitle}>Security</Text>
        <TouchableOpacity style={styles.optionItem} onPress={() => openModal('userManagement')}>
          <Text style={styles.optionText}>Manage Admin</Text>
          <Ionicons name="person-circle-outline" size={20} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={() => openModal('changePassword')}>
          <Text style={styles.optionText}>Change Password</Text>
          <Ionicons name="lock-closed" size={20} color="#333" />
        </TouchableOpacity>

        {/* Data Management */}
        <Text style={styles.sectionTitle}>Data Management</Text>
        <TouchableOpacity style={styles.optionItem} onPress={() => openModal('backup')}>
          <Text style={styles.optionText}>Backup Data</Text>
          <Ionicons name="cloud-upload-outline" size={20} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={() => openModal('restore')}>
          <Text style={styles.optionText}>Restore Data</Text>
          <Ionicons name="cloud-download-outline" size={20} color="#333" />
        </TouchableOpacity>

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.optionItem} onPress={() => openModal('about')}>
          <Text style={styles.optionText}>App Version</Text>
          <Text style={styles.optionValue}>v1.0.0</Text>
          <Ionicons name="information-circle-outline" size={20} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={() => openModal('support')}>
          <Text style={styles.optionText}>Contact Support</Text>
          <Ionicons name="mail-outline" size={20} color="#333" />
        </TouchableOpacity>
      </ScrollView>

      {/* Single Modal for all options */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Conditionally render content based on the selected option */}
            {selectedOption === 'userManagement' && (
              <>
                <Text style={styles.modalTitle}>Edit User Information</Text>
                <TextInput
                  style={styles.input}
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="Username"
                />
                <TextInput
                  style={styles.input}
                  value={userEmail}
                  onChangeText={setUserEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  secureTextEntry={true}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </>
            )}

            {selectedOption === 'changePassword' && (
              <>
                <Text style={styles.modalTitle}>Change Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  value={password}
                  secureTextEntry={true}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                  <Text style={styles.saveButtonText}>Change Password</Text>
                </TouchableOpacity>
              </>
            )}

            {selectedOption === 'currency' && (
              <>
                <Text style={styles.modalTitle}>Select Currency</Text>
                <TouchableOpacity style={styles.modalOption}>
                  <Text style={styles.modalOptionText}>KSH</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalOption}>
                  <Text style={styles.modalOptionText}>USD</Text>
                </TouchableOpacity>
              </>
            )}
            {selectedOption === 'businessInfo' && (
              <>
                <Text style={styles.modalTitle}>Business Information</Text>
                <TextInput style={styles.input} placeholder="Business Name" />
                <TextInput style={styles.input} placeholder="Address" />
                <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" />
                <TouchableOpacity style={styles.saveButton} onPress={closeModal}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </>
            )}
            {selectedOption === 'backup' && (
              <>
                <Text style={styles.modalTitle}>Backup Data</Text>
                <Text style={styles.modalText}>Are you sure you want to backup your data?</Text>
                <TouchableOpacity style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Backup Now</Text>
                </TouchableOpacity>
              </>
            )}
            {selectedOption === 'restore' && (
              <>
                <Text style={styles.modalTitle}>Restore Data</Text>
                <Text style={styles.modalText}>Restoring data will overwrite current data.</Text>
                <TouchableOpacity style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Restore Now</Text>
                </TouchableOpacity>
              </>
            )}
            {selectedOption === 'about' && (
              <>
                <Text style={styles.modalTitle}>About the App</Text>
                <Text style={styles.modalText}>POS App v1.0.0</Text>
                <Text style={styles.modalText}>Developed by Your Company</Text>
              </>
            )}
            {selectedOption === 'support' && (
              <>
                <Text style={styles.modalTitle}>Contact Support</Text>
                <TouchableOpacity style={styles.contactItem}>
                  <Ionicons name="mail-outline" size={20} color="#333" style={styles.icon} />
                  <Text style={styles.modalText}>funcorpdevelopers@gmail.com</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactItem}>
                  <Ionicons name="globe-outline" size={20} color="#333" style={styles.icon} />
                  <Text style={styles.modalText}>funcorpdevelopers.netlify.app</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactItem}>
                  <Ionicons name="call-outline" size={20} color="#333" style={styles.icon} />
                  <Text style={styles.modalText}>+254743050069</Text>
                </TouchableOpacity>
              </>
            )}
            {/* Additional modals as needed */}

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Roboto', 
  },
  scrollContainer: {
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#007aff',
    marginTop: 20,
    marginLeft: 20,
    fontFamily: 'Roboto',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
    padding: 15,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 7,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Roboto',
  },
  optionValue: {
    fontSize: 16,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#007aff',
    marginBottom: 20,
    fontFamily: 'Roboto',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  modalOption: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    marginBottom: 10,
    borderRadius: 5,
  },
  modalOptionText: {
    fontSize: 18,
    color: '#007aff',
  },
  saveButton: {
    backgroundColor: '#007aff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#007aff',
    fontSize: 16,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SettingsScreen;
