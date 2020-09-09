import 'react-native-gesture-handler';
import * as React from 'react';
import { StyleSheet, Button, View, Text, Image } from 'react-native';
import { Icon } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import MainScreen from './Components/MainScreen';

class App extends React.Component {

  render() {
    return (
      <MainScreen />
    );
  }

}

export default App;