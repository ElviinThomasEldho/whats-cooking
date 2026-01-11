import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Recipe {
  id: string;
  name: string;
  cookingTime: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  ingredients: string[];
  instructions?: string[];
  notes?: string;
  rating?: number;
  cookedCount: number;
  lastCooked?: Date;
  createdAt: Date;
  image?: string;
}

interface RecipeState {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
}

type RecipeAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_RECIPES'; payload: Recipe[] }
  | { type: 'ADD_RECIPE'; payload: Recipe }
  | { type: 'UPDATE_RECIPE'; payload: Recipe }
  | { type: 'DELETE_RECIPE'; payload: string }
  | { type: 'MARK_COOKED'; payload: { id: string; date: Date } }
  | { type: 'UPDATE_RATING'; payload: { id: string; rating: number } };

const initialState: RecipeState = {
  recipes: [],
  loading: false,
  error: null,
};

const recipeReducer = (state: RecipeState, action: RecipeAction): RecipeState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_RECIPES':
      return { ...state, recipes: action.payload };
    case 'ADD_RECIPE':
      return { ...state, recipes: [...state.recipes, action.payload] };
    case 'UPDATE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe.id === action.payload.id ? action.payload : recipe
        ),
      };
    case 'DELETE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.filter(recipe => recipe.id !== action.payload),
      };
    case 'MARK_COOKED':
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe.id === action.payload.id
            ? {
                ...recipe,
                cookedCount: recipe.cookedCount + 1,
                lastCooked: action.payload.date,
              }
            : recipe
        ),
      };
    case 'UPDATE_RATING':
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe.id === action.payload.id
            ? { ...recipe, rating: action.payload.rating }
            : recipe
        ),
      };
    default:
      return state;
  }
};

interface RecipeContextType {
  state: RecipeState;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'cookedCount'>) => void;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  markAsCooked: (id: string) => void;
  updateRating: (id: string, rating: number) => void;
  getRandomRecipe: () => Recipe | null;
  searchByIngredients: (ingredients: string[]) => Recipe[];
  filterRecipes: (filters: {
    difficulty?: string;
    cuisine?: string;
    maxTime?: number;
    minRating?: number;
  }) => Recipe[];
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  // Load recipes from storage on app start
  useEffect(() => {
    loadRecipes();
  }, []);

  // Save recipes to storage whenever recipes change
  useEffect(() => {
    saveRecipes();
  }, [state.recipes]);

  const loadRecipes = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const storedRecipes = await AsyncStorage.getItem('recipes');
      if (storedRecipes) {
        const recipes = JSON.parse(storedRecipes);
        // Convert date strings back to Date objects
        const parsedRecipes = recipes.map((recipe: any) => ({
          ...recipe,
          createdAt: new Date(recipe.createdAt),
          lastCooked: recipe.lastCooked ? new Date(recipe.lastCooked) : undefined,
        }));
        dispatch({ type: 'SET_RECIPES', payload: parsedRecipes });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load recipes' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveRecipes = async () => {
    try {
      await AsyncStorage.setItem('recipes', JSON.stringify(state.recipes));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save recipes' });
    }
  };

  const addRecipe = (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'cookedCount'>) => {
    const newRecipe: Recipe = {
      ...recipeData,
      id: Date.now().toString(),
      createdAt: new Date(),
      cookedCount: 0,
    };
    dispatch({ type: 'ADD_RECIPE', payload: newRecipe });
  };

  const updateRecipe = (recipe: Recipe) => {
    dispatch({ type: 'UPDATE_RECIPE', payload: recipe });
  };

  const deleteRecipe = (id: string) => {
    dispatch({ type: 'DELETE_RECIPE', payload: id });
  };

  const markAsCooked = (id: string) => {
    dispatch({ type: 'MARK_COOKED', payload: { id, date: new Date() } });
  };

  const updateRating = (id: string, rating: number) => {
    dispatch({ type: 'UPDATE_RATING', payload: { id, rating } });
  };

  const getRandomRecipe = (): Recipe | null => {
    if (state.recipes.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * state.recipes.length);
    return state.recipes[randomIndex];
  };

  const searchByIngredients = (ingredients: string[]): Recipe[] => {
    if (ingredients.length === 0) return state.recipes;
    
    return state.recipes.filter(recipe => {
      const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
      return ingredients.some(ingredient =>
        recipeIngredients.some(recipeIng =>
          recipeIng.includes(ingredient.toLowerCase()) ||
          ingredient.toLowerCase().includes(recipeIng)
        )
      );
    });
  };

  const filterRecipes = (filters: {
    difficulty?: string;
    cuisine?: string;
    maxTime?: number;
    minRating?: number;
  }): Recipe[] => {
    return state.recipes.filter(recipe => {
      if (filters.difficulty && recipe.difficulty !== filters.difficulty) return false;
      if (filters.cuisine && !recipe.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase())) return false;
      if (filters.maxTime && recipe.cookingTime > filters.maxTime) return false;
      if (filters.minRating && (recipe.rating || 0) < filters.minRating) return false;
      return true;
    });
  };

  const value: RecipeContextType = {
    state,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    markAsCooked,
    updateRating,
    getRandomRecipe,
    searchByIngredients,
    filterRecipes,
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
}; 