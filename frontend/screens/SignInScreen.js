import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Icon } from 'react-native-elements';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      if (email === '' || password === '') {
        Alert.alert('Error', 'Please fill in all fields.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://192.168.1.25:5000/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'You have signed in successfully!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', data.error || 'Failed to sign in. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.circles}></View> */}
      <View style={styles.titleMain}>
        <Text style={styles.header}>PesaTrack</Text>
      </View>
      <View style={styles.headerCover}>
        <Text style={styles.headerMain}>Sign In</Text>
      </View>
      <Text style={styles.subtitle}>Enter your email and password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
        {loading ? (
          <Icon name="spinner" size={24} color="#fff" type="font-awesome" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  headerCover: {
    width: '100%',
    height: 60,
    borderRadius: 50,
    backgroundColor: '#0008',
    right: '-55%',
    marginBottom: 10,
  },
  headerMain: {
    textAlign: 'left',
    paddingHorizontal: 20,
    paddingVertical: 5,
    fontWeight: 'bold',
    fontSize: 32,
    color: '#fff',
  },
  titleMain: {
    
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
  },
  footerLink: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
