import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  IconButton,
  useTheme,
  Divider,
  List,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRecipeContext } from '../context/RecipeContext';
import { Recipe } from '../context/RecipeContext';

const { width } = Dimensions.get('window');

export default function RecipeDetailScreen({ navigation, route }: any) {
  const theme = useTheme();
  const { markAsCooked, updateRating } = useRecipeContext();
  
  // Convert string dates back to Date objects
  const rawRecipe = route.params.recipe;
  const recipe: Recipe = {
    ...rawRecipe,
    createdAt: new Date(rawRecipe.createdAt),
    lastCooked: rawRecipe.lastCooked ? new Date(rawRecipe.lastCooked) : undefined,
  };

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(recipe.cookingTime * 60); // Convert to seconds

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#81B29A'; // Sage green
      case 'Medium': return '#E07A5F'; // Terracotta orange
      case 'Hard': return '#BA1A1A'; // Error red
      default: return theme.colors.outline;
    }
  };

  const handleMarkAsCooked = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    markAsCooked(recipe.id);
    Alert.alert(
      'Recipe Cooked! 🎉',
      `Great job cooking ${recipe.name}! Keep up the amazing work!`,
      [{ text: 'Thanks!' }]
    );
  };

  const handleShare = async () => {
    try {
      const instructionsText = recipe.instructions && recipe.instructions.length > 0 
        ? `\n\nInstructions:\n${recipe.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}`
        : '';
      await Share.share({
        message: `Check out this amazing recipe: ${recipe.name}\n\nCooking Time: ${formatTime(recipe.cookingTime)}\nDifficulty: ${recipe.difficulty}\nCuisine: ${recipe.cuisine}\n\nIngredients:\n${recipe.ingredients.join('\n')}${instructionsText}`,
        title: recipe.name,
      });
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  const handleEdit = () => {
    // Convert Date objects to strings for navigation
    const recipeForNavigation = {
      ...recipe,
      createdAt: recipe.createdAt.toISOString(),
      lastCooked: recipe.lastCooked?.toISOString(),
    };
    navigation.navigate('AddRecipe', { recipe: recipeForNavigation, isEditing: true });
  };

  const handleRatingChange = (rating: number) => {
    updateRating(recipe.id, rating);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          clearInterval(interval);
          Alert.alert('Timer Complete! ⏰', 'Your cooking time is up!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setTimeRemaining(recipe.cookingTime * 60);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recipe Image */}
        <Card style={styles.imageCard}>
          <Card.Cover
            source={
              recipe.image
                ? { uri: recipe.image }
                : require('../../assets/cover-photos/top-view-bowls-with-indian-food.jpg')
            }
            style={styles.recipeImage}
          />
          <View style={styles.imageOverlay}>
            <View style={styles.headerActions}>
              <IconButton
                icon="share-variant"
                size={24}
                iconColor="white"
                style={styles.actionButton}
                onPress={handleShare}
              />
              <IconButton
                icon="pencil"
                size={24}
                iconColor="white"
                style={styles.actionButton}
                onPress={handleEdit}
              />
            </View>
          </View>
        </Card>

        {/* Recipe Info */}
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.recipeTitle}>
            {recipe.name}
          </Text>

          {/* Meta Info */}
          <View style={styles.metaContainer}>
            <Chip
              icon="clock-outline"
              style={[styles.chip, { backgroundColor: theme.colors.primaryContainer }]}
            >
              {formatTime(recipe.cookingTime)}
            </Chip>
            <Chip
              icon="star-outline"
              style={[
                styles.chip,
                { backgroundColor: getDifficultyColor(recipe.difficulty) + '20' }
              ]}
            >
              {recipe.difficulty}
            </Chip>
            <Chip
              icon="restaurant"
              style={[styles.chip, { backgroundColor: theme.colors.secondaryContainer }]}
            >
              {recipe.cuisine}
            </Chip>
          </View>

          {/* Rating */}
          <View style={styles.ratingSection}>
            <Text variant="bodyMedium" style={styles.ratingLabel}>
              Rate this recipe:
            </Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                  key={star}
                  icon={star <= (recipe.rating || 0) ? 'star' : 'star-outline'}
                  size={24}
                  onPress={() => handleRatingChange(star)}
                  iconColor={theme.colors.secondary}
                />
              ))}
            </View>
            {recipe.rating && (
              <Text variant="bodySmall" style={styles.ratingText}>
                {recipe.rating}/5 stars
              </Text>
            )}
          </View>

          {/* Cooking Timer */}
          <Card style={styles.timerCard}>
            <Card.Content style={styles.timerContent}>
              <Text variant="titleMedium" style={styles.timerLabel}>
                Cooking Timer
              </Text>
              <Text variant="displaySmall" style={styles.timerDisplay}>
                {formatTimer(timeRemaining)}
              </Text>
              <View style={styles.timerButtons}>
                {!isTimerRunning ? (
                  <Button
                    mode="contained"
                    onPress={startTimer}
                    icon="play"
                    style={styles.timerButton}
                  >
                    Start Timer
                  </Button>
                ) : (
                  <Button
                    mode="contained"
                    onPress={stopTimer}
                    icon="stop"
                    style={[styles.timerButton, { backgroundColor: theme.colors.error }]}
                  >
                    Stop Timer
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>

          {/* Ingredients */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Ingredients
              </Text>
              <View style={styles.ingredientsList}>
                {recipe.ingredients.map((ingredient, index) => (
                  <List.Item
                    key={index}
                    title={ingredient}
                    left={(props) => <List.Icon {...props} icon="circle-small" />}
                    titleStyle={styles.ingredientText}
                  />
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* Instructions */}
          {recipe.instructions && recipe.instructions.length > 0 && (
            <Card style={styles.sectionCard}>
              <Card.Content>
                <Text variant="titleLarge" style={styles.sectionTitle}>
                  Instructions
                </Text>
                {recipe.instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                      <Text variant="bodySmall" style={styles.numberText}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text variant="bodyMedium" style={styles.instructionText}>
                      {instruction}
                    </Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}

          {/* Notes */}
          {recipe.notes && (
            <Card style={styles.sectionCard}>
              <Card.Content>
                <Text variant="titleLarge" style={styles.sectionTitle}>
                  Notes
                </Text>
                <Text variant="bodyMedium" style={styles.notesText}>
                  {recipe.notes}
                </Text>
              </Card.Content>
            </Card>
          )}

          {/* Cooking Stats */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Cooking Stats
              </Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={styles.statNumber}>
                    {recipe.cookedCount}
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    Times Cooked
                  </Text>
                </View>
                {recipe.lastCooked && (
                  <View style={styles.statItem}>
                    <Text variant="bodyMedium" style={styles.statLabel}>
                      Last Cooked
                    </Text>
                    <Text variant="bodyMedium" style={styles.statValue}>
                      {new Date(recipe.lastCooked).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.actionButton}
        >
          Back to Recipes
        </Button>
        <Button
          mode="contained"
          onPress={handleMarkAsCooked}
          icon="check"
          style={styles.actionButton}
        >
          Mark as Cooked
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageCard: {
    margin: 0,
    elevation: 0,
    borderRadius: 0,
  },
  recipeImage: {
    height: 280,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    padding: 20,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
  },
  content: {
    padding: 24,
  },
  recipeTitle: {
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 26,
    letterSpacing: 0.5,
    lineHeight: 32,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
    justifyContent: 'center',
  },
  chip: {
    height: 36,
    borderRadius: 18,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 28,
    paddingVertical: 20,
    backgroundColor: 'rgba(224, 122, 95, 0.05)',
    borderRadius: 20,
  },
  ratingLabel: {
    marginBottom: 12,
    fontWeight: '600',
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingText: {
    marginTop: 8,
    opacity: 0.7,
    fontWeight: '500',
  },
  timerCard: {
    marginBottom: 28,
    elevation: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  timerContent: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: 'rgba(129, 178, 154, 0.08)',
  },
  timerLabel: {
    marginBottom: 12,
    fontWeight: '600',
    fontSize: 16,
  },
  timerDisplay: {
    fontWeight: '800',
    marginBottom: 20,
    fontSize: 32,
    letterSpacing: 1,
  },
  timerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  timerButton: {
    minWidth: 140,
    borderRadius: 20,
  },
  sectionCard: {
    marginBottom: 20,
    elevation: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 20,
    fontSize: 20,
    letterSpacing: 0.3,
  },
  ingredientsList: {
    marginTop: 12,
  },
  ingredientText: {
    fontSize: 16,
    lineHeight: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingVertical: 4,
  },
  instructionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E07A5F', // Terracotta orange
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  numberText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  instructionText: {
    flex: 1,
    lineHeight: 26,
    fontSize: 16,
  },
  notesText: {
    lineHeight: 26,
    fontStyle: 'italic',
    fontSize: 16,
    color: 'rgba(45, 42, 36, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: '800',
    color: '#E07A5F', // Terracotta orange
    fontSize: 28,
  },
  statLabel: {
    marginTop: 6,
    opacity: 0.7,
    fontWeight: '500',
    fontSize: 14,
  },
  statValue: {
    marginTop: 6,
    fontWeight: '600',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 24,
    gap: 16,
  },
}); 