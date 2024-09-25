import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CartProvider } from './screens/CartContext'; 
import HomeScreen from './screens/HomeScreen';
import SignInScreen from './screens/SignInScreen'
import SignUpScreen from './screens/SignUpScreen';
import DashboardScreen from './screens/DashboardScreen';
import SalesAnalyticsScreen from './screens/SalesAnalyticsScreen';
import MonthlySalesScreen from './screens/MonthlySalesScreen';
import SettingsScreen from './screens/SettingsScreen';
import UserPermissionsScreen from './screens/UserPermissionsScreen';
import ManageInventoryScreen from './screens/ManageInventoryScreen';
import ExpenseScreen from './screens/ExpenseScreen';
const Stack = createStackNavigator();
export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Dashboard">  
          <Stack.Screen name="Signin" component={SignInScreen} options={{headerShown: false}} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{headerShown: false}} />
          <Stack.Screen name="SalesAnalytics" component={SalesAnalyticsScreen} options={{headerShown: false}}  />
          <Stack.Screen name="MonthlySales" component={MonthlySalesScreen} options={{headerShown: false}} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}} />
          <Stack.Screen name="ManageInventory" component={ManageInventoryScreen}  options={{headerShown: false}}/>
          <Stack.Screen name="UserPermissions" component={UserPermissionsScreen} options={{headerShown: false}} />
          <Stack.Screen name="Expenses" component={ExpenseScreen} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
