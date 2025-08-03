import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, View, Text, Alert, Modal, StyleSheet } from 'react-native';
import IncomeScreen from './screens/IncomeScreen';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import LogExpenseScreen from './screens/LogExpenseScreen';
import { RootStackParamList } from './constants/types';
import ManageExpensesScreen from './screens/ManageExpensesScreen';
import ComingSoonScreen from './screens/ComingSoonScreen';
import EditExpenseScreen from './screens/EditExpenseScreen';
import EditIncomeScreen from './screens/EditIncomeScreen';
import AddIncomeScreen from './screens/AddIncomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Hamburger Menu Component
const HamburgerMenu = ({ navigation }: { navigation: any }) => {
  const [sideMenuVisible, setSideMenuVisible] = React.useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setSideMenuVisible(true)}
        style={headerStyles.hamburgerButton}
      >
        <View style={headerStyles.menuLine} />
        <View style={headerStyles.menuLine} />
        <View style={headerStyles.menuLine} />
      </TouchableOpacity>

      {/* Side Menu Modal */}
      <Modal
        visible={sideMenuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSideMenuVisible(false)}
      >
        <View style={headerStyles.sideMenuOverlay}>
          <TouchableOpacity
            style={headerStyles.sideMenuBackdrop}
            onPress={() => setSideMenuVisible(false)}
            activeOpacity={1}
          />
          <View style={headerStyles.sideMenu}>
            <View style={headerStyles.sideMenuHeader}>
              <Text style={headerStyles.sideMenuHeaderTitle}>Menu</Text>
              <TouchableOpacity
                style={headerStyles.sideMenuCloseButton}
                onPress={() => setSideMenuVisible(false)}
              >
                <Text style={headerStyles.sideMenuCloseButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            
            <View style={headerStyles.sideMenuItems}>
              <TouchableOpacity
                style={headerStyles.sideMenuItem}
                onPress={() => {
                  setSideMenuVisible(false);
                  navigation.navigate('Profile');
                }}
              >
                <Text style={headerStyles.sideMenuItemText}>Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={headerStyles.sideMenuItem}
                onPress={() => {
                  setSideMenuVisible(false);
                  navigation.navigate('Support');
                }}
              >
                <Text style={headerStyles.sideMenuItemText}>Support</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={headerStyles.sideMenuItem}
                onPress={() => {
                  setSideMenuVisible(false);
                  navigation.navigate('Contact');
                }}
              >
                <Text style={headerStyles.sideMenuItemText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#4f46e5',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={({ navigation }) => ({ 
              title: 'Budget Buddy',
              headerRight: () => <HamburgerMenu navigation={navigation} />
            })}
          />
          <Stack.Screen name="Add Income" component={AddIncomeScreen} />
          <Stack.Screen name="Income" component={IncomeScreen} />
          <Stack.Screen name="Log Expense" component={LogExpenseScreen} />
          <Stack.Screen name="ManageExpenses" component={ManageExpensesScreen} />
          <Stack.Screen name="Edit Expense" component={EditExpenseScreen} />
          <Stack.Screen name="Edit Income" component={EditIncomeScreen} />
          <Stack.Screen 
            name="Profile" 
            component={ComingSoonScreen}
            options={{ title: 'Profile' }}
          />
          <Stack.Screen 
            name="Support" 
            component={ComingSoonScreen}
            options={{ title: 'Support' }}
          />
          <Stack.Screen 
            name="Contact" 
            component={ComingSoonScreen}
            options={{ title: 'Contact' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const headerStyles = StyleSheet.create({
  hamburgerButton: {
    padding: 8,
    marginRight: 8,
  },
  menuLine: {
    width: 18,
    height: 2,
    backgroundColor: '#ffffff',
    marginVertical: 2,
    borderRadius: 1,
  },
  sideMenuOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  sideMenuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sideMenu: {
    width: 280,
    backgroundColor: '#ffffff',
    height: '100%',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sideMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sideMenuHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  sideMenuCloseButton: {
    padding: 4,
  },
  sideMenuCloseButtonText: {
    fontSize: 24,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  sideMenuItems: {
    paddingTop: 20,
  },
  sideMenuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sideMenuItemText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
});