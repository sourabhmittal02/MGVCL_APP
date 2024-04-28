import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationService from './src/Service/NavigationService';

import Login from './src/Login';
import Dashboard from './src/Dashboard';
// import Splash from './src/Splash';
// import Header from './src/Header';
import Profile from './src/Profile';
import RegisterComplaint from './src/RegisterComplaint';
import AddKNO from './src/AddKNO';
import ComplaintStatus from './src/ComplaintStatus';
import FRTComplaint from './src/FRTComplaint';
import Sign from './src/Sign';
import AddRemark from './src/AddRemark';
import SignUp from './src/SignUp';

const Stack = createNativeStackNavigator();
function App() {
  global.URL = "http://117.238.193.115/MGVCLCoreCallCenterAPI/";
  // global.URL = "http://117.250.3.20/CoreCallCenterAPI/";
  global.TITLE = "MGVCL";
  return (
    <>
      <NavigationContainer ref={(navigatorRef) => {
        NavigationService.setTopLevelNavigator(navigatorRef)
      }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="AddKNO" component={AddKNO} />
          <Stack.Screen name="RegisterComplaint" component={RegisterComplaint} />
          <Stack.Screen name="ComplaintStatus" component={ComplaintStatus} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="FRTComplaint" component={FRTComplaint} />
          <Stack.Screen name="Sign" component={Sign} />
          <Stack.Screen name="AddRemark" component={AddRemark} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;