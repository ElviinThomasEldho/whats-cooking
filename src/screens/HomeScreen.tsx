import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  FAB,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRecipeContext } from '../context/RecipeContext';
import { Recipe } from '../context/RecipeContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const theme = useTheme();
  const { state, getRandomRecipe, markAsCooked } = useRecipeContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSurpriseMe = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      const randomRecipe = getRandomRecipe();
      setIsLoading(false);
      
      if (randomRecipe) {
        // Convert Date objects to strings for navigation
        const recipeForNavigation = {
          ...randomRecipe,
          createdAt: randomRecipe.createdAt.toISOString(),
          lastCooked: randomRecipe.lastCooked?.toISOString(),
        };
        navigation.navigate('Recipes', {
          screen: 'RecipeDetail',
          params: { recipe: recipeForNavigation },
        });
      } else {
        Alert.alert(
          'No Recipes Yet!',
          'Add some recipes to your collection to get cooking suggestions.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Add Recipe', onPress: () => navigation.navigate('Recipes', { screen: 'AddRecipe' }) },
          ]
        );
      }
    }, 1000);
  };

  const getRecentlyCooked = (): Recipe[] => {
    return state.recipes
      .filter(recipe => recipe.lastCooked)
      .sort((a, b) => new Date(b.lastCooked!).getTime() - new Date(a.lastCooked!).getTime())
      .slice(0, 3);
  };

  const getTrendingRecipes = (): Recipe[] => {
    return state.recipes
      .sort((a, b) => b.cookedCount - a.cookedCount)
      .slice(0, 3);
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return theme.colors.tertiary;
      case 'Medium': return theme.colors.secondary;
      case 'Hard': return theme.colors.error;
      default: return theme.colors.outline;
    }
  };

  const renderRecipeCard = (recipe: Recipe, onPress: () => void) => (
    <Card key={recipe.id} style={styles.recipeCard} onPress={onPress}>
      <Card.Cover
        source={
          recipe.image
            ? { uri: recipe.image }
            : require('../../assets/cover-photos/top-view-bowls-with-indian-food.jpg')
        }
        style={styles.cardImage}
      />
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium" numberOfLines={1} style={styles.recipeTitle}>
          {recipe.name}
        </Text>
        <View style={styles.cardMeta}>
          <Chip
            icon="clock-outline"
            textStyle={{ fontSize: 12 }}
            style={[styles.chip, { backgroundColor: theme.colors.primaryContainer }]}
          >
            {formatTime(recipe.cookingTime)}
          </Chip>
          <Chip
            icon="star-outline"
            textStyle={{ fontSize: 12 }}
            style={[
              styles.chip,
              { backgroundColor: getDifficultyColor(recipe.difficulty) + '20' }
            ]}
          >
            {recipe.difficulty}
          </Chip>
        </View>
        {recipe.rating && (
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= recipe.rating! ? 'star' : 'star-outline'}
                size={16}
                color={theme.colors.secondary}
              />
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Cover Photo */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['rgba(224, 122, 95, 0.2)', 'rgba(129, 178, 154, 0.8)']}
            style={styles.headerOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <Text variant="headlineMedium" style={styles.welcomeText}>
              What's Cooking Today?
            </Text>
            <Text variant="bodyLarge" style={styles.subtitleText}>
              Discover your next delicious meal
            </Text>
          </LinearGradient>
          <Card.Cover
            source={require('../../assets/cover-photos/top-view-table-full-delicious-food-composition.jpg')}
            style={styles.headerImage}
          />
        </View>

        {/* Surprise Me Button */}
        <View style={styles.surpriseContainer}>
          <Button
            mode="contained"
            onPress={handleSurpriseMe}
            disabled={isLoading || state.recipes.length === 0}
            style={styles.surpriseButton}
            contentStyle={styles.surpriseButtonContent}
            labelStyle={styles.surpriseButtonLabel}
            icon={isLoading ? undefined : 'shuffle'}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.onPrimary} />
            ) : (
              'Surprise Me! 🍳'
            )}
          </Button>
          {state.recipes.length === 0 && (
            <Text variant="bodySmall" style={styles.emptyStateText}>
              Add your first recipe to get started!
            </Text>
          )}
        </View>

        {/* Recently Cooked */}
        {getRecentlyCooked().length > 0 && (
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Recently Cooked
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getRecentlyCooked().map((recipe) =>
                renderRecipeCard(recipe, () =>
                  navigation.navigate('Recipes', {
                    screen: 'RecipeDetail',
                    params: { recipe },
                  })
                )
              )}
            </ScrollView>
          </View>
        )}

        {/* Trending Recipes */}
        {getTrendingRecipes().length > 0 && (
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Most Cooked
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getTrendingRecipes().map((recipe) =>
                renderRecipeCard(recipe, () =>
                  navigation.navigate('Recipes', {
                    screen: 'RecipeDetail',
                    params: { recipe },
                  })
                )
              )}
            </ScrollView>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Card style={styles.actionCard} onPress={() => navigation.navigate('Recipes', { screen: 'AddRecipe' })}>
            <Card.Content style={styles.actionContent}>
              <Ionicons name="restaurant" size={32} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.actionText}>Add Recipe</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.actionCard} onPress={() => navigation.navigate('Search')}>
            <Card.Content style={styles.actionContent}>
              <Ionicons name="search" size={32} color={theme.colors.secondary} />
              <Text variant="titleMedium" style={styles.actionText}>Find Recipes</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {state.recipes.length}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Total Recipes
              </Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {state.recipes.reduce((sum, recipe) => sum + recipe.cookedCount, 0)}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Times Cooked
              </Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* FAB for quick add */}
      <FAB
        icon="restaurant"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('Recipes', { screen: 'AddRecipe' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
    height: 280,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    zIndex: 1,
  },
  welcomeText: {
    color: 'white',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 28,
    letterSpacing: 0.5,
  },
  subtitleText: {
    color: 'white',
    textAlign: 'center',
    opacity: 0.95,
    fontSize: 16,
    lineHeight: 22,
  },
  surpriseContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  surpriseButton: {
    borderRadius: 32,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    minWidth: 200,
  },
  surpriseButtonContent: {
    height: 64,
    paddingHorizontal: 48,
  },
  surpriseButtonLabel: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emptyStateText: {
    marginTop: 16,
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 36,
  },
  sectionTitle: {
    marginBottom: 20,
    fontWeight: '700',
    fontSize: 22,
    letterSpacing: 0.3,
  },
  recipeCard: {
    width: width * 0.75,
    marginRight: 20,
    marginBottom: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardImage: {
    height: 140,
    borderRadius: 20,
  },
  cardContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  recipeTitle: {
    marginBottom: 12,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  chip: {
    height: 28,
    borderRadius: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 15,
  },
  actionCard: {
    flex: 1,
    elevation: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionContent: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  actionText: {
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 120,
  },
  statCard: {
    flex: 1,
    elevation: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  statNumber: {
    fontWeight: '800',
    marginBottom: 6,
    fontSize: 24,
  },
  statLabel: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 12,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    margin: 24,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
}); 