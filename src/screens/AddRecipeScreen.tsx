import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Chip,
  SegmentedButtons,
  useTheme,
  HelperText,
  IconButton,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRecipeContext } from '../context/RecipeContext';
import { Recipe } from '../context/RecipeContext';

// Common ingredients for auto-complete
const COMMON_INGREDIENTS = [
  'Salt', 'Pepper', 'Olive Oil', 'Garlic', 'Onion', 'Tomato', 'Chicken', 'Beef',
  'Rice', 'Pasta', 'Flour', 'Eggs', 'Milk', 'Butter', 'Cheese', 'Lemon',
  'Basil', 'Oregano', 'Thyme', 'Rosemary', 'Cumin', 'Paprika', 'Chili Powder',
  'Soy Sauce', 'Worcestershire Sauce', 'Honey', 'Sugar', 'Bread', 'Potato',
  'Carrot', 'Broccoli', 'Spinach', 'Mushroom', 'Bell Pepper', 'Cucumber',
  'Avocado', 'Lime', 'Ginger', 'Cilantro', 'Parsley', 'Bay Leaves'
];

export default function AddRecipeScreen({ navigation, route }: any) {
  const theme = useTheme();
  const { addRecipe, updateRecipe } = useRecipeContext();
  const isEditing = route.params?.isEditing || false;
  const existingRecipe = route.params?.recipe;

  const [formData, setFormData] = useState({
    name: '',
    cookingTime: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    cuisine: '',
    ingredients: [] as string[],
    instructions: [] as string[],
    notes: '',
    rating: 0,
  });

  const [currentIngredient, setCurrentIngredient] = useState('');
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [showIngredientSuggestions, setShowIngredientSuggestions] = useState(false);
  const [image, setImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isEditing && existingRecipe) {
      // Convert string dates back to Date objects if needed
      const recipe = {
        ...existingRecipe,
        createdAt: typeof existingRecipe.createdAt === 'string' 
          ? new Date(existingRecipe.createdAt) 
          : existingRecipe.createdAt,
        lastCooked: existingRecipe.lastCooked 
          ? (typeof existingRecipe.lastCooked === 'string' 
              ? new Date(existingRecipe.lastCooked) 
              : existingRecipe.lastCooked)
          : undefined,
      };
      
      setFormData({
        name: recipe.name,
        cookingTime: recipe.cookingTime.toString(),
        difficulty: recipe.difficulty,
        cuisine: recipe.cuisine,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions || [],
        notes: recipe.notes || '',
        rating: recipe.rating || 0,
      });
      setImage(recipe.image);
    }
  }, [isEditing, existingRecipe]);

  const filteredIngredients = COMMON_INGREDIENTS.filter(ingredient =>
    ingredient.toLowerCase().includes(currentIngredient.toLowerCase()) &&
    !formData.ingredients.includes(ingredient)
  );

  const handleAddIngredient = (ingredient: string) => {
    if (ingredient.trim() && !formData.ingredients.includes(ingredient.trim())) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient.trim()],
      }));
      setCurrentIngredient('');
      setShowIngredientSuggestions(false);
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing !== ingredient),
    }));
  };

  const handleAddInstruction = () => {
    if (currentInstruction.trim()) {
      setFormData(prev => ({
        ...prev,
        instructions: [...prev.instructions, currentInstruction.trim()],
      }));
      setCurrentInstruction('');
    }
  };

  const handleRemoveInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a recipe name');
      return false;
    }
    if (!formData.cookingTime || parseInt(formData.cookingTime) <= 0) {
      Alert.alert('Error', 'Please enter a valid cooking time');
      return false;
    }
    if (!formData.cuisine.trim()) {
      Alert.alert('Error', 'Please enter a cuisine type');
      return false;
    }
    if (formData.ingredients.length === 0) {
      Alert.alert('Error', 'Please add at least one ingredient');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const recipeData = {
      name: formData.name.trim(),
      cookingTime: parseInt(formData.cookingTime),
      difficulty: formData.difficulty,
      cuisine: formData.cuisine.trim(),
      ingredients: formData.ingredients,
      instructions: formData.instructions.length > 0 ? formData.instructions : undefined,
      notes: formData.notes.trim() || undefined,
      rating: formData.rating,
      image,
    };

    if (isEditing && existingRecipe) {
      updateRecipe({
        ...existingRecipe,
        ...recipeData,
      });
    } else {
      addRecipe(recipeData);
    }

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.recipeImage} />
              <IconButton
                icon="close"
                size={20}
                style={styles.removeImageButton}
                onPress={() => setImage(undefined)}
              />
            </View>
          ) : (
            <Button
              mode="outlined"
              onPress={handlePickImage}
              icon="camera"
              style={styles.addImageButton}
            >
              Add Recipe Photo
            </Button>
          )}
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Recipe Name */}
          <TextInput
            label="Recipe Name"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            style={styles.input}
            mode="outlined"
          />

          {/* Cooking Time */}
          <TextInput
            label="Cooking Time (minutes)"
            value={formData.cookingTime}
            onChangeText={(text) => setFormData(prev => ({ ...prev, cookingTime: text }))}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />

          {/* Difficulty */}
          <Text variant="bodyMedium" style={styles.label}>Difficulty Level</Text>
          <SegmentedButtons
            value={formData.difficulty}
            onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value as 'Easy' | 'Medium' | 'Hard' }))}
            buttons={[
              { value: 'Easy', label: 'Easy' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Hard', label: 'Hard' },
            ]}
            style={styles.segmentedButton}
          />

          {/* Cuisine */}
          <TextInput
            label="Cuisine Type"
            value={formData.cuisine}
            onChangeText={(text) => setFormData(prev => ({ ...prev, cuisine: text }))}
            style={styles.input}
            mode="outlined"
            placeholder="e.g., Italian, Mexican, Asian..."
          />

          {/* Ingredients */}
          <Text variant="bodyMedium" style={styles.label}>Ingredients</Text>
          <View style={styles.ingredientInput}>
            <TextInput
              label="Add ingredient"
              value={currentIngredient}
              onChangeText={(text) => {
                setCurrentIngredient(text);
                setShowIngredientSuggestions(text.length > 0);
              }}
              style={styles.ingredientTextInput}
              mode="outlined"
              right={
                <TextInput.Icon
                  icon="plus"
                  onPress={() => handleAddIngredient(currentIngredient)}
                />
              }
            />
          </View>

          {/* Ingredient Suggestions */}
          {showIngredientSuggestions && filteredIngredients.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {filteredIngredients.slice(0, 5).map((ingredient) => (
                <Chip
                  key={ingredient}
                  onPress={() => handleAddIngredient(ingredient)}
                  style={styles.suggestionChip}
                >
                  {ingredient}
                </Chip>
              ))}
            </View>
          )}

          {/* Ingredients List */}
          <View style={styles.ingredientsList}>
            {formData.ingredients.map((ingredient, index) => (
              <Chip
                key={index}
                onClose={() => handleRemoveIngredient(ingredient)}
                style={styles.ingredientChip}
              >
                {ingredient}
              </Chip>
            ))}
          </View>

          {/* Instructions */}
          <Text variant="bodyMedium" style={styles.label}>Instructions (optional)</Text>
          <View style={styles.instructionInput}>
            <TextInput
              label="Add instruction step"
              value={currentInstruction}
              onChangeText={setCurrentInstruction}
              style={styles.instructionTextInput}
              mode="outlined"
              multiline
              right={
                <TextInput.Icon
                  icon="plus"
                  onPress={handleAddInstruction}
                />
              }
            />
          </View>

          {/* Instructions List */}
          <View style={styles.instructionsList}>
            {formData.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text variant="bodySmall">{index + 1}</Text>
                </View>
                <Text variant="bodyMedium" style={styles.instructionText}>
                  {instruction}
                </Text>
                <IconButton
                  icon="close"
                  size={16}
                  onPress={() => handleRemoveInstruction(index)}
                  style={styles.removeInstructionButton}
                />
              </View>
            ))}
          </View>

          {/* Notes */}
          <TextInput
            label="Notes (optional)"
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
          />

          {/* Rating */}
          <Text variant="bodyMedium" style={styles.label}>Rating</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconButton
                key={star}
                icon={star <= formData.rating ? 'star' : 'star-outline'}
                size={24}
                onPress={() => setFormData(prev => ({ ...prev, rating: star }))}
                iconColor={theme.colors.secondary}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          contentStyle={styles.saveButtonContent}
        >
          {isEditing ? 'Update Recipe' : 'Save Recipe'}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageSection: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(224, 122, 95, 0.05)', // Soft terracotta background
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  recipeImage: {
    width: 220,
    height: 160,
    borderRadius: 20,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
  },
  addImageButton: {
    width: 220,
    height: 160,
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(224, 122, 95, 0.3)',
    backgroundColor: 'rgba(224, 122, 95, 0.05)',
  },
  formContainer: {
    padding: 24,
  },
  input: {
    marginBottom: 20,
    borderRadius: 16,
  },
  label: {
    marginBottom: 12,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  segmentedButton: {
    marginBottom: 20,
  },
  ingredientInput: {
    marginBottom: 12,
  },
  ingredientTextInput: {
    marginBottom: 12,
    borderRadius: 16,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  suggestionChip: {
    marginBottom: 6,
    borderRadius: 16,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  ingredientChip: {
    marginBottom: 6,
    borderRadius: 16,
  },
  instructionInput: {
    marginBottom: 12,
  },
  instructionTextInput: {
    marginBottom: 12,
    borderRadius: 16,
  },
  instructionsList: {
    marginBottom: 28,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'rgba(129, 178, 154, 0.08)', // Soft green background
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E07A5F', // Terracotta orange
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  instructionText: {
    flex: 1,
    marginTop: 4,
    fontSize: 15,
    lineHeight: 22,
  },
  removeInstructionButton: {
    margin: -8,
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
    borderRadius: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 28,
    paddingVertical: 16,
    backgroundColor: 'rgba(224, 122, 95, 0.05)',
    borderRadius: 16,
  },
  saveButtonContainer: {
    padding: 24,
    paddingBottom: 48,
  },
  saveButton: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  saveButtonContent: {
    height: 56,
  },
}); 