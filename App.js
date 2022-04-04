import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import MapScreen from './MapScreen';
//import { fireDB } from './firebase';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={ {
        headerStyle: {backgroundColor: 'orangered'},
        headerTintColor: '#fff',
        headerTitleStyle: {fontWeight: 'bold'},
      }}>

        <Stack.Screen component={LoginScreen} name = "Login"></Stack.Screen>
        <Stack.Screen component={HomeScreen} name = "Home"></Stack.Screen>
        <Stack.Screen component={MapScreen} name = "Map"></Stack.Screen>

    </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
