# What's Cooking? 🍳

A modern, intuitive mobile cooking app built with React Native and Expo to help home cooks manage their recipes and get smart cooking suggestions.

## Features

### 🏠 Home Dashboard
- **Surprise Me!** - Get random recipe suggestions from your collection
- **Recently Cooked** - Quick access to your latest culinary adventures
- **Most Cooked** - See your favorite recipes
- **Quick Actions** - Fast access to add recipes and search
- **Cooking Stats** - Track your culinary journey

### 📚 Recipe Management
- **Add Recipe Screen** - Comprehensive form with ingredient tagging and auto-complete
- **Recipe Library** - Grid/list view with search and smart filtering
- **Recipe Details** - Full recipe view with cooking timer and interactive features
- **Edit/Delete** - Modify or remove existing recipes
- **Recipe Sharing** - Export and share your favorite recipes

### 🔍 Smart Search
- **Ingredient-Based Search** - Find recipes using available ingredients
- **Name Search** - Search by recipe names
- **Quick Ingredients** - Pre-defined common ingredients for easy selection
- **Smart Filtering** - Filter by difficulty, cuisine, cooking time, and ratings

### 🤖 AI Cooking Assistant
- **Chat Interface** - Ask cooking questions and get helpful responses
- **Cooking Tips** - Learn techniques and best practices
- **Ingredient Substitutions** - Find alternatives for missing ingredients
- **Recipe Suggestions** - Get personalized recommendations
- **Quick Questions** - Pre-defined common cooking questions

### 👤 Profile & Settings
- **Cooking Insights** - View your cooking statistics and preferences
- **App Settings** - Customize dark mode, notifications, and haptic feedback
- **Data Export** - Share your recipe collection
- **About & Support** - App information and help

## Description

What's Cooking? is a modern, intuitive mobile cooking application that helps home cooks manage their recipes, discover new dishes, and get cooking assistance. The app features an AI-powered cooking assistant, smart recipe search by ingredients, and comprehensive recipe management tools. Built with React Native and Expo, it provides a seamless cross-platform experience.

## Technologies Used

- **Framework**: Expo ~53.0.20
- **Language**: TypeScript 5.8.3
- **React Native**: 0.79.5
- **React**: 19.0.0
- **Navigation**: 
  - @react-navigation/native 7.1.16
  - @react-navigation/bottom-tabs 7.4.4
  - @react-navigation/stack 7.4.4
- **Storage**: @react-native-async-storage/async-storage 2.1.2
- **Image Handling**: 
  - expo-image-picker 16.1.4
  - expo-file-system 18.1.11
- **UI Components**: 
  - react-native-paper 5.14.5
  - expo-linear-gradient 14.1.5
- **Icons**: 
  - @expo/vector-icons 14.1.0
  - react-native-vector-icons 10.3.0
- **Additional Features**:
  - expo-haptics 14.1.4 (haptic feedback)
  - expo-font 13.3.2 (custom fonts)
  - react-native-safe-area-context 5.4.0
  - react-native-screens 4.11.1

## Technical Features

- **Offline-First** - Works without internet connection
- **Local Storage** - All data stored locally using AsyncStorage
- **Image Support** - Add photos to your recipes
- **Cooking Timer** - Built-in timer for precise cooking
- **Haptic Feedback** - Tactile responses for better UX
- **Modern UI** - Clean, intuitive design with warm food-inspired colors
- **Cross-Platform** - Works on iOS, Android, and Web

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whats-cooking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Install the Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or run on simulator/emulator:
     ```bash
     npm run ios     # iOS Simulator
     npm run android # Android Emulator
     npm run web     # Web Browser
     ```

## Project Structure

```
src/
├── context/
│   └── RecipeContext.tsx    # State management for recipes
├── screens/
│   ├── HomeScreen.tsx       # Main dashboard
│   ├── RecipeLibraryScreen.tsx # Recipe list and management
│   ├── AddRecipeScreen.tsx  # Add/edit recipe form
│   ├── RecipeDetailScreen.tsx # Recipe details and timer
│   ├── SearchScreen.tsx     # Ingredient and name search
│   ├── AIAssistantScreen.tsx # AI cooking assistant
│   └── ProfileScreen.tsx    # User profile and settings
└── theme/
    └── theme.ts            # App theme and colors
```

## Usage Guide

### Adding Your First Recipe
1. Tap the **"+"** button or go to **Recipes** tab
2. Fill in the recipe details:
   - Name, cooking time, difficulty, cuisine
   - Add ingredients (with auto-complete suggestions)
   - Write step-by-step instructions
   - Add optional notes and rating
   - Include a photo (optional)
3. Tap **"Save Recipe"**

### Getting Recipe Suggestions
1. On the **Home** screen, tap **"Surprise Me!"**
2. The app will randomly select a recipe from your collection
3. View the recipe details and start cooking!

### Searching by Ingredients
1. Go to the **Search** tab
2. Select **"Search by Ingredients"**
3. Choose from quick ingredients or add custom ones
4. View matching recipes from your collection

### Using the AI Assistant
1. Go to the **AI Assistant** tab
2. Ask cooking questions like:
   - "How do I cook pasta perfectly?"
   - "What can I substitute for eggs?"
   - "How do I make a roux?"
3. Get helpful cooking tips and advice

### Cooking with Timer
1. Open any recipe detail
2. Tap **"Start Timer"** to begin the cooking timer
3. The timer will alert you when cooking time is complete
4. Tap **"Mark as Cooked"** to track your cooking history

## Customization

### Adding New Ingredients
Edit the `COMMON_INGREDIENTS` array in `src/screens/AddRecipeScreen.tsx` to add more ingredient suggestions.

### Modifying AI Responses
Update the `generateAIResponse` function in `src/screens/AIAssistantScreen.tsx` to add more cooking knowledge.

### Changing Colors
Modify the theme colors in `src/theme/theme.ts` to match your preferences.

## Future Enhancements

- **Cloud Sync** - Backup recipes to the cloud
- **Meal Planning** - Plan weekly meals
- **Shopping Lists** - Generate lists from recipes
- **Nutritional Info** - Calculate recipe nutrition
- **Social Features** - Share recipes with friends
- **Voice Commands** - Hands-free recipe navigation
- **Advanced AI** - Integration with Claude API for enhanced responses

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:
- Check the app's **About** section for help
- Review the documentation above
- Open an issue on GitHub

---

**Happy Cooking! 👨‍🍳👩‍🍳** 