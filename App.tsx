import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import RecipeLibraryScreen from './src/screens/RecipeLibraryScreen';
import AddRecipeScreen from './src/screens/AddRecipeScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import SearchScreen from './src/screens/SearchScreen';
import AIAssistantScreen from './src/screens/AIAssistantScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Import theme and context
import { theme } from './src/theme/theme';
import { RecipeProvider } from './src/context/RecipeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function RecipeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecipeLibrary" component={RecipeLibraryScreen} />
      <Stack.Screen name="AddRecipe" component={AddRecipeScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Recipes') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'AI Assistant') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: "What's Cooking?", headerShown: false }}
      />
      <Tab.Screen 
        name="Recipes" 
        component={RecipeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ title: "Find Recipes" }}
      />
      <Tab.Screen 
        name="AI Assistant" 
        component={AIAssistantScreen}
        options={{ title: "Cooking AI" }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <RecipeProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <TabNavigator />
        </NavigationContainer>
      </RecipeProvider>
    </PaperProvider>
  );
}
