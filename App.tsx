// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import AddPaycheckScreen from './screens/AddPaycheckScreen';
// import AddBudgetScreen from './screens/AddBudgetScreen';
import LogExpenseScreen from './screens/LogExpenseScreen';
// import BudgetOverviewScreen from './screens/BudgetOverviewScreen';
import { RootStackParamList } from './constants/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4f46e5',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Budget Buddy' }}
          />
          <Stack.Screen name="Add Paycheck" component={AddPaycheckScreen} />
          {/* <Stack.Screen name="Add Budget" component={AddBudgetScreen} />
           */}
          <Stack.Screen name="Log Expense" component={LogExpenseScreen} />
          {/* <Stack.Screen 
            name="Budgets" 
            component={BudgetOverviewScreen}
            options={{ title: 'Budget Overview' }}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}