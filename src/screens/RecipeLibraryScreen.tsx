import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  Searchbar,
  FAB,
  Menu,
  Button,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRecipeContext } from '../context/RecipeContext';
import { Recipe } from '../context/RecipeContext';

const { width } = Dimensions.get('window');

export default function RecipeLibraryScreen({ navigation }: any) {
  const theme = useTheme();
  const { state, deleteRecipe } = useRecipeContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: '',
    cuisine: '',
    maxTime: 0,
  });

  const filteredRecipes = useMemo(() => {
    let filtered = state.recipes;

    // Search by name
    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (selectedFilters.difficulty) {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedFilters.difficulty);
    }
    if (selectedFilters.cuisine) {
      filtered = filtered.filter(recipe =>
        recipe.cuisine.toLowerCase().includes(selectedFilters.cuisine.toLowerCase())
      );
    }
    if (selectedFilters.maxTime > 0) {
      filtered = filtered.filter(recipe => recipe.cookingTime <= selectedFilters.maxTime);
    }

    return filtered;
  }, [state.recipes, searchQuery, selectedFilters]);

  const handleDeleteRecipe = (recipe: Recipe) => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${recipe.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteRecipe(recipe.id),
        },
      ]
    );
  };

  const clearFilters = () => {
    setSelectedFilters({
      difficulty: '',
      cuisine: '',
      maxTime: 0,
    });
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#81B29A'; // Sage green
      case 'Medium': return '#E07A5F'; // Terracotta orange
      case 'Hard': return '#BA1A1A'; // Error red
      default: return theme.colors.outline;
    }
  };

  const renderRecipeCard = ({ item: recipe }: { item: Recipe }) => (
    <Card
      style={[
        styles.recipeCard,
        viewMode === 'grid' ? styles.gridCard : styles.listCard,
      ]}
      onPress={() => {
        // Convert Date objects to strings for navigation
        const recipeForNavigation = {
          ...recipe,
          createdAt: recipe.createdAt.toISOString(),
          lastCooked: recipe.lastCooked?.toISOString(),
        };
        navigation.navigate('RecipeDetail', { recipe: recipeForNavigation });
      }}
    >
      <Card.Cover
        source={
          recipe.image
            ? { uri: recipe.image }
            : require('../../assets/cover-photos/top-view-bowls-with-indian-food.jpg')
        }
        style={viewMode === 'grid' ? styles.gridImage : styles.listImage}
      />
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text
            variant="titleMedium"
            numberOfLines={viewMode === 'grid' ? 1 : 2}
            style={styles.recipeTitle}
          >
            {recipe.name}
          </Text>
          <Menu
            visible={false}
            onDismiss={() => {}}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={20}
                onPress={() => {}}
                style={styles.menuButton}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                // Convert Date objects to strings for navigation
                const recipeForNavigation = {
                  ...recipe,
                  createdAt: recipe.createdAt.toISOString(),
                  lastCooked: recipe.lastCooked?.toISOString(),
                };
                navigation.navigate('AddRecipe', { recipe: recipeForNavigation, isEditing: true });
              }}
              title="Edit"
              leadingIcon="pencil"
            />
            <Menu.Item
              onPress={() => handleDeleteRecipe(recipe)}
              title="Delete"
              leadingIcon="delete"
            />
          </Menu>
        </View>

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
          <Chip
            icon="restaurant"
            textStyle={{ fontSize: 12 }}
            style={[styles.chip, { backgroundColor: theme.colors.secondaryContainer }]}
          >
            {recipe.cuisine}
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
            <Text variant="bodySmall" style={styles.ratingText}>
              ({recipe.rating}/5)
            </Text>
          </View>
        )}

        {recipe.cookedCount > 0 && (
          <Text variant="bodySmall" style={styles.cookedCount}>
            Cooked {recipe.cookedCount} time{recipe.cookedCount > 1 ? 's' : ''}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="book-outline" size={64} color={theme.colors.outline} />
      <Text variant="titleMedium" style={styles.emptyTitle}>
        No recipes found
      </Text>
      <Text variant="bodyMedium" style={styles.emptySubtitle}>
        {searchQuery || Object.values(selectedFilters).some(Boolean)
          ? 'Try adjusting your search or filters'
          : 'Add your first recipe to get started!'}
      </Text>
      {!searchQuery && !Object.values(selectedFilters).some(Boolean) && (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddRecipe')}
          style={styles.addButton}
        >
          Add Recipe
        </Button>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with search and filters */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Search recipes..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <View style={styles.headerActions}>
          <IconButton
            icon={viewMode === 'grid' ? 'view-list' : 'view-grid'}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          />
          <IconButton
            icon="filter-variant"
            onPress={() => setFilterVisible(!filterVisible)}
          />
        </View>
      </View>

      {/* Filters */}
      {filterVisible && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip
              selected={selectedFilters.difficulty === 'Easy'}
              onPress={() =>
                setSelectedFilters(prev => ({
                  ...prev,
                  difficulty: prev.difficulty === 'Easy' ? '' : 'Easy',
                }))
              }
              style={styles.filterChip}
            >
              Easy
            </Chip>
            <Chip
              selected={selectedFilters.difficulty === 'Medium'}
              onPress={() =>
                setSelectedFilters(prev => ({
                  ...prev,
                  difficulty: prev.difficulty === 'Medium' ? '' : 'Medium',
                }))
              }
              style={styles.filterChip}
            >
              Medium
            </Chip>
            <Chip
              selected={selectedFilters.difficulty === 'Hard'}
              onPress={() =>
                setSelectedFilters(prev => ({
                  ...prev,
                  difficulty: prev.difficulty === 'Hard' ? '' : 'Hard',
                }))
              }
              style={styles.filterChip}
            >
              Hard
            </Chip>
            <Chip
              selected={selectedFilters.maxTime === 30}
              onPress={() =>
                setSelectedFilters(prev => ({
                  ...prev,
                  maxTime: prev.maxTime === 30 ? 0 : 30,
                }))
              }
              style={styles.filterChip}
            >
              Quick (≤30m)
            </Chip>
            <Chip
              selected={selectedFilters.maxTime === 60}
              onPress={() =>
                setSelectedFilters(prev => ({
                  ...prev,
                  maxTime: prev.maxTime === 60 ? 0 : 60,
                }))
              }
              style={styles.filterChip}
            >
              Medium (≤1h)
            </Chip>
            <Button
              mode="text"
              onPress={clearFilters}
              style={styles.clearButton}
            >
              Clear
            </Button>
          </ScrollView>
        </View>
      )}

      {/* Recipe List */}
      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AddRecipe')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: 'rgba(224, 122, 95, 0.03)',
  },
  searchbar: {
    flex: 1,
    elevation: 6,
    borderRadius: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(129, 178, 154, 0.05)',
  },
  filterChip: {
    marginRight: 12,
    borderRadius: 16,
  },
  clearButton: {
    marginLeft: 12,
    borderRadius: 16,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  recipeCard: {
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gridCard: {
    width: (width - 56) / 2,
    marginRight: 16,
  },
  listCard: {
    width: '100%',
  },
  gridImage: {
    height: 140,
  },
  listImage: {
    height: 220,
  },
  cardContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recipeTitle: {
    flex: 1,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
  },
  menuButton: {
    margin: -8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
  },
  cardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  chip: {
    height: 28,
    borderRadius: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  ratingText: {
    marginLeft: 6,
    fontWeight: '500',
  },
  cookedCount: {
    opacity: 0.7,
    fontWeight: '500',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    marginTop: 20,
    marginBottom: 12,
    fontWeight: '700',
    fontSize: 20,
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 28,
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 40,
  },
  addButton: {
    marginTop: 12,
    borderRadius: 20,
    elevation: 6,
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