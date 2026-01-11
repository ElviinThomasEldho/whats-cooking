import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  Searchbar,
  Button,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRecipeContext } from '../context/RecipeContext';
import { Recipe } from '../context/RecipeContext';

const { width } = Dimensions.get('window');

// Common ingredients for quick selection
const QUICK_INGREDIENTS = [
  'Chicken', 'Beef', 'Fish', 'Pasta', 'Rice', 'Potato', 'Tomato', 'Onion',
  'Garlic', 'Cheese', 'Eggs', 'Milk', 'Butter', 'Olive Oil', 'Lemon', 'Basil'
];

export default function SearchScreen({ navigation }: any) {
  const theme = useTheme();
  const { searchByIngredients, filterRecipes } = useRecipeContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ingredients' | 'name'>('ingredients');

  const searchResults = useMemo(() => {
    if (activeFilter === 'ingredients' && selectedIngredients.length > 0) {
      return searchByIngredients(selectedIngredients);
    } else if (activeFilter === 'name' && searchQuery.trim()) {
      return filterRecipes({}).filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [];
  }, [selectedIngredients, searchQuery, activeFilter, searchByIngredients, filterRecipes]);

  const handleAddIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(prev => [...prev, ingredient]);
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => prev.filter(ing => ing !== ingredient));
  };

  const handleAddCustomIngredient = () => {
    if (currentIngredient.trim() && !selectedIngredients.includes(currentIngredient.trim())) {
      setSelectedIngredients(prev => [...prev, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedIngredients([]);
    setCurrentIngredient('');
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

  const renderRecipeCard = ({ item: recipe }: { item: Recipe }) => (
    <Card
      style={styles.recipeCard}
      onPress={() => {
        // Convert Date objects to strings for navigation
        const recipeForNavigation = {
          ...recipe,
          createdAt: recipe.createdAt.toISOString(),
          lastCooked: recipe.lastCooked?.toISOString(),
        };
        navigation.navigate('Recipes', {
          screen: 'RecipeDetail',
          params: { recipe: recipeForNavigation },
        });
      }}
    >
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

        <Text variant="bodySmall" style={styles.ingredientsPreview}>
          {recipe.ingredients.slice(0, 3).join(', ')}
          {recipe.ingredients.length > 3 && '...'}
        </Text>

        {recipe.rating && (
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= recipe.rating! ? 'star' : 'star-outline'}
                size={14}
                color={theme.colors.secondary}
              />
            ))}
            <Text variant="bodySmall" style={styles.ratingText}>
              ({recipe.rating}/5)
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name={activeFilter === 'ingredients' ? 'restaurant' : 'search-outline'} 
        size={64} 
        color={theme.colors.outline} 
      />
      <Text variant="titleMedium" style={styles.emptyTitle}>
        {activeFilter === 'ingredients' 
          ? 'No recipes found with these ingredients'
          : 'No recipes found'
        }
      </Text>
      <Text variant="bodyMedium" style={styles.emptySubtitle}>
        {activeFilter === 'ingredients'
          ? 'Try adding different ingredients or check your spelling'
          : 'Try adjusting your search terms'
        }
      </Text>
      <Button
        mode="outlined"
        onPress={clearSearch}
        style={styles.clearButton}
      >
        Clear Search
      </Button>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <Searchbar
          placeholder={
            activeFilter === 'ingredients' 
              ? "Search by ingredients..." 
              : "Search recipe names..."
          }
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <IconButton
          icon={activeFilter === 'ingredients' ? 'restaurant' : 'text-search'}
          onPress={() => setActiveFilter(activeFilter === 'ingredients' ? 'name' : 'ingredients')}
          style={styles.filterButton}
        />
      </View>

      {/* Search Mode Tabs */}
      <View style={styles.tabContainer}>
        <Button
          mode={activeFilter === 'ingredients' ? 'contained' : 'outlined'}
          onPress={() => setActiveFilter('ingredients')}
          style={styles.tabButton}
        >
          Search by Ingredients
        </Button>
        <Button
          mode={activeFilter === 'name' ? 'contained' : 'outlined'}
          onPress={() => setActiveFilter('name')}
          style={styles.tabButton}
        >
          Search by Name
        </Button>
      </View>

      {activeFilter === 'ingredients' && (
        <>
          {/* Quick Ingredients */}
          <View style={styles.quickIngredients}>
            <Text variant="bodyMedium" style={styles.sectionTitle}>
              Quick Select Ingredients
            </Text>
            <View style={styles.ingredientsGrid}>
              {QUICK_INGREDIENTS.map((ingredient) => (
                <Chip
                  key={ingredient}
                  onPress={() => handleAddIngredient(ingredient)}
                  style={[
                    styles.quickChip,
                    selectedIngredients.includes(ingredient) && styles.selectedChip
                  ]}
                  textStyle={selectedIngredients.includes(ingredient) ? { color: 'white' } : {}}
                >
                  {ingredient}
                </Chip>
              ))}
            </View>
          </View>

          {/* Custom Ingredient Input */}
          <View style={styles.customIngredient}>
            <Text variant="bodyMedium" style={styles.sectionTitle}>
              Add Custom Ingredient
            </Text>
            <View style={styles.inputContainer}>
              <Searchbar
                placeholder="Type an ingredient..."
                onChangeText={setCurrentIngredient}
                value={currentIngredient}
                style={styles.ingredientInput}
                onSubmitEditing={handleAddCustomIngredient}
              />
              <Button
                mode="contained"
                onPress={handleAddCustomIngredient}
                disabled={!currentIngredient.trim()}
                style={styles.addButton}
              >
                Add
              </Button>
            </View>
          </View>

          {/* Selected Ingredients */}
          {selectedIngredients.length > 0 && (
            <View style={styles.selectedIngredients}>
              <Text variant="bodyMedium" style={styles.sectionTitle}>
                Selected Ingredients ({selectedIngredients.length})
              </Text>
              <View style={styles.selectedChips}>
                {selectedIngredients.map((ingredient) => (
                  <Chip
                    key={ingredient}
                    onClose={() => handleRemoveIngredient(ingredient)}
                    style={styles.selectedChip}
                    textStyle={{ color: 'white' }}
                  >
                    {ingredient}
                  </Chip>
                ))}
              </View>
              <Button
                mode="text"
                onPress={() => setSelectedIngredients([])}
                style={styles.clearIngredientsButton}
              >
                Clear All
              </Button>
            </View>
          )}
        </>
      )}

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text variant="titleMedium" style={styles.resultsTitle}>
            {searchResults.length > 0 
              ? `Found ${searchResults.length} recipe${searchResults.length > 1 ? 's' : ''}`
              : 'Search Results'
            }
          </Text>
          {(searchQuery || selectedIngredients.length > 0) && (
            <Button
              mode="text"
              onPress={clearSearch}
              style={styles.clearResultsButton}
            >
              Clear
            </Button>
          )}
        </View>

        <FlatList
          data={searchResults}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.resultsList}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  searchbar: {
    flex: 1,
    elevation: 2,
  },
  filterButton: {
    margin: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
  },
  quickIngredients: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickChip: {
    marginBottom: 4,
  },
  selectedChip: {
    backgroundColor: '#FF6B35',
  },
  customIngredient: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  ingredientInput: {
    flex: 1,
    elevation: 2,
  },
  addButton: {
    justifyContent: 'center',
  },
  selectedIngredients: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  selectedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  clearIngredientsButton: {
    alignSelf: 'flex-start',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsTitle: {
    fontWeight: '600',
  },
  clearResultsButton: {
    margin: 0,
  },
  resultsList: {
    padding: 16,
    paddingBottom: 100,
  },
  recipeCard: {
    width: (width - 48) / 2,
    marginRight: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    height: 120,
  },
  cardContent: {
    paddingTop: 12,
  },
  recipeTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    height: 24,
  },
  ingredientsPreview: {
    opacity: 0.7,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    marginLeft: 4,
    opacity: 0.7,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  clearButton: {
    marginTop: 8,
  },
}); 