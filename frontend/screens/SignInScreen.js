
import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Image, Linking, Alert } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';  

const SignInScreen = ({ navigation }) => {   
  const [email, setEmail] = useState('');   
  const [password, setPassword] = useState('');   
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => { 
    if (!email || !password) { 
      Alert.alert('Login Error', 'Please fill in all the fields');
      return; 
    } 
    setLoading(true);
    try {       
      const response = await fetch('http://192.168.100.20/payment/admin/signin.php', {         
        method: 'POST',         
        headers: { 'Content-Type': 'application/json' },         
        body: JSON.stringify({ email, password }),       
      });        

      const data = await response.json();       
      setLoading(false);
       
      if (data.success) {         
        // Store session token in AsyncStorage         
        await AsyncStorage.setItem('session_token', data.sessionId);
        Alert.alert('Success', 'Logged in successfully');         
        navigation.replace('Dashboard');
      } else {         
        Alert.alert('Login Error', data.message || 'Invalid credentials');       
      }     
    } catch (error) {       
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');     
    }   
  };    

  const handleCreateAccount = () => {     
    const url = 'http://funcorpdevelopers.netlify.app';     
    Linking.openURL(url)       
      .catch(error => console.error("Couldn't load the page", error));
  };   

  return (     
    <SafeAreaView style={styles.container}>       
      {/* Logo */}       
      <View style={styles.logoContainer}>         
        <Image           
          source={require('../assets/logo.png')}           
          style={styles.logo}         
        />       
      </View>        

      <Text style={styles.title}>Welcome Back</Text>       
      <Text style={styles.subtitle}>Sign in to continue</Text>        

      <View style={styles.inputContainer}>         
        <Ionicons name="mail-outline" size={20} color="#555" />         
        <TextInput           
          style={styles.input}           
          placeholder="Email"           
          value={email}           
          onChangeText={setEmail}           
          keyboardType="email-address"         
        />       
      </View>        

      <View style={styles.inputContainer}>         
        <Ionicons name="lock-closed-outline" size={20} color="#555" />         
        <TextInput           
          style={styles.input}           
          placeholder="Password"           
          value={password}           
          onChangeText={setPassword}           
          secureTextEntry={true}         
        />       
      </View>        

      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.signInButtonText}>Sign In</Text>         
          
        )}
        <Ionicons name="arrow-forward-circle-outline" size={24} color="#fff" />
      </TouchableOpacity>        

      <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => navigation.navigate("Reset")}>         
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>       
      </TouchableOpacity>        

      <View style={styles.signUpContainer}>       
        <TouchableOpacity onPress={handleCreateAccount} style={styles.createAccountButton}>         
          <Text style={styles.createAccountText}>Don't have an account? Create one</Text>       
        </TouchableOpacity>       
      </View>     
    </SafeAreaView>   
  ); 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60, 
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  signInButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007aff',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  forgotPasswordButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#007aff',
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  createAccountButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f9fa', 
    alignItems: 'center',
    borderRadius: 5,
  },
  createAccountText: {
    color: '#007bff',
    fontSize: 16,
  },
});

export default SignInScreen;
