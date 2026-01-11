import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  List,
  Switch,
  useTheme,
  Divider,
  Avatar,
  IconButton,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRecipeContext } from '../context/RecipeContext';

export default function ProfileScreen({ navigation }: any) {
  const theme = useTheme();
  const { state } = useRecipeContext();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const totalRecipes = state.recipes.length;
  const totalCooked = state.recipes.reduce((sum, recipe) => sum + recipe.cookedCount, 0);
  const averageRating = state.recipes.length > 0
    ? (state.recipes.reduce((sum, recipe) => sum + (recipe.rating || 0), 0) / state.recipes.length).toFixed(1)
    : '0.0';

  const favoriteCuisine = state.recipes.length > 0
    ? state.recipes.reduce((acc, recipe) => {
        acc[recipe.cuisine] = (acc[recipe.cuisine] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {};

  const topCuisine = Object.entries(favoriteCuisine)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None yet';

  const handleExportRecipes = async () => {
    try {
      const recipesText = state.recipes.map(recipe => {
        return `${recipe.name}\n\nCooking Time: ${recipe.cookingTime} minutes\nDifficulty: ${recipe.difficulty}\nCuisine: ${recipe.cuisine}\n\nIngredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}\n\n---\n\n`;
      }).join('');

      await Share.share({
        message: `My Recipe Collection\n\n${recipesText}`,
        title: 'My Recipes',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export recipes');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your recipes and cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            // This would clear all data in a real implementation
            Alert.alert('Data Cleared', 'All recipes have been deleted.');
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About What\'s Cooking?',
      'Version 1.0.0\n\nA modern cooking app to help you manage recipes and discover new dishes. Built with React Native and Expo.\n\nFeatures:\n• Recipe management\n• Smart suggestions\n• AI cooking assistant\n• Ingredient-based search\n• Cooking timer\n• Recipe sharing',
      [{ text: 'OK' }]
    );
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getTotalCookingTime = () => {
    return state.recipes.reduce((sum, recipe) => sum + (recipe.cookingTime * recipe.cookedCount), 0);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Icon
              size={80}
              icon="chef-hat"
              style={[styles.profileAvatar, { backgroundColor: theme.colors.primary }]}
            />
            <Text variant="headlineSmall" style={styles.profileName}>
              Home Chef
            </Text>
            <Text variant="bodyMedium" style={styles.profileSubtitle}>
              Cooking enthusiast
            </Text>
          </Card.Content>
        </Card>

        {/* Cooking Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="book-outline" size={32} color={theme.colors.primary} />
              <Text variant="headlineMedium" style={styles.statNumber}>
                {totalRecipes}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Recipes
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="restaurant" size={32} color={theme.colors.secondary} />
              <Text variant="headlineMedium" style={styles.statNumber}>
                {totalCooked}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Times Cooked
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="star-outline" size={32} color={theme.colors.tertiary} />
              <Text variant="headlineMedium" style={styles.statNumber}>
                {averageRating}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Avg Rating
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Cooking Insights */}
        {state.recipes.length > 0 && (
          <Card style={styles.insightsCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Cooking Insights
              </Text>
              
              <List.Item
                title="Favorite Cuisine"
                description={topCuisine}
                left={(props) => <List.Icon {...props} icon="restaurant" />}
                style={styles.insightItem}
              />
              
              <List.Item
                title="Total Cooking Time"
                description={formatTime(getTotalCookingTime())}
                left={(props) => <List.Icon {...props} icon="clock-outline" />}
                style={styles.insightItem}
              />
              
              <List.Item
                title="Most Cooked Recipe"
                description={
                  state.recipes.length > 0
                    ? state.recipes.reduce((max, recipe) => 
                        recipe.cookedCount > max.cookedCount ? recipe : max
                      ).name
                    : 'None yet'
                }
                left={(props) => <List.Icon {...props} icon="trophy" />}
                style={styles.insightItem}
              />
            </Card.Content>
          </Card>
        )}

        {/* App Settings */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              App Settings
            </Text>
            
            <List.Item
              title="Dark Mode"
              description="Switch to dark theme"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  color={theme.colors.primary}
                />
              )}
              style={styles.settingItem}
            />
            
            <Divider />
            
            <List.Item
              title="Notifications"
              description="Get cooking reminders"
              left={(props) => <List.Icon {...props} icon="bell-outline" />}
              right={() => (
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  color={theme.colors.primary}
                />
              )}
              style={styles.settingItem}
            />
            
            <Divider />
            
            <List.Item
              title="Haptic Feedback"
              description="Vibrate on interactions"
              left={(props) => <List.Icon {...props} icon="vibrate" />}
              right={() => (
                <Switch
                  value={hapticFeedback}
                  onValueChange={setHapticFeedback}
                  color={theme.colors.primary}
                />
              )}
              style={styles.settingItem}
            />
          </Card.Content>
        </Card>

        {/* Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Actions
            </Text>
            
            <Button
              mode="outlined"
              onPress={handleExportRecipes}
              icon="export"
              style={styles.actionButton}
              disabled={state.recipes.length === 0}
            >
              Export Recipes
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Recipes', { screen: 'AddRecipe' })}
              icon="plus"
              style={styles.actionButton}
            >
              Add New Recipe
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Search')}
              icon="magnify"
              style={styles.actionButton}
            >
              Search Recipes
            </Button>
          </Card.Content>
        </Card>

        {/* About & Support */}
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              About & Support
            </Text>
            
            <List.Item
              title="About App"
              description="Version and features"
              left={(props) => <List.Icon {...props} icon="information-outline" />}
              onPress={handleAbout}
              style={styles.aboutItem}
            />
            
            <Divider />
            
            <List.Item
              title="Rate App"
              description="Share your feedback"
              left={(props) => <List.Icon {...props} icon="star-outline" />}
              onPress={() => Alert.alert('Rate App', 'This would open the app store rating page.')}
              style={styles.aboutItem}
            />
            
            <Divider />
            
            <List.Item
              title="Share App"
              description="Tell friends about us"
              left={(props) => <List.Icon {...props} icon="share-variant" />}
              onPress={() => Share.share({
                message: 'Check out What\'s Cooking? - A great app for managing recipes and getting cooking suggestions!',
                title: 'What\'s Cooking?',
              })}
              style={styles.aboutItem}
            />
            
            <Divider />
            
            <List.Item
              title="Clear All Data"
              description="Delete all recipes"
              left={(props) => <List.Icon {...props} icon="delete" color={theme.colors.error} />}
              onPress={handleClearData}
              style={styles.aboutItem}
            />
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    margin: 16,
    elevation: 4,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileAvatar: {
    marginBottom: 16,
  },
  profileName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileSubtitle: {
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statNumber: {
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statLabel: {
    textAlign: 'center',
    opacity: 0.7,
  },
  insightsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  insightItem: {
    paddingVertical: 4,
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  settingItem: {
    paddingVertical: 4,
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  actionButton: {
    marginBottom: 12,
  },
  aboutCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    elevation: 2,
  },
  aboutItem: {
    paddingVertical: 4,
  },
}); 