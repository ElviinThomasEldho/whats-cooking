import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Chip,
  useTheme,
  IconButton,
  Avatar,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRecipeContext } from '../context/RecipeContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  "How do I cook pasta perfectly?",
  "What can I substitute for eggs?",
  "How do I make a roux?",
  "What's the best way to season chicken?",
  "How do I prevent onions from making me cry?",
  "What's the difference between baking soda and baking powder?",
];

const COOKING_TIPS = [
  "Always read the recipe completely before starting",
  "Prep all ingredients before cooking (mise en place)",
  "Taste as you cook and adjust seasoning",
  "Don't overcrowd the pan when sautéing",
  "Let meat rest after cooking",
  "Use a timer for precise cooking times",
];

export default function AIAssistantScreen() {
  const theme = useTheme();
  const { state } = useRecipeContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your cooking assistant. I can help you with recipe suggestions, cooking tips, ingredient substitutions, and answer any cooking questions you might have. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple rule-based responses (in a real app, this would connect to Claude API)
    if (lowerMessage.includes('pasta') || lowerMessage.includes('noodle')) {
      return "To cook pasta perfectly:\n\n1. Use a large pot with plenty of water (4-6 quarts for 1 pound pasta)\n2. Add salt to the water (about 1-2 tablespoons per pound)\n3. Bring water to a rolling boil before adding pasta\n4. Cook according to package directions, but test 2 minutes before\n5. Reserve 1 cup of pasta water before draining\n6. Drain pasta but don't rinse (unless making a cold salad)\n7. Toss immediately with sauce and reserved water if needed";
    }
    
    if (lowerMessage.includes('egg') && lowerMessage.includes('substitute')) {
      return "Here are great egg substitutes:\n\n• 1/4 cup applesauce = 1 egg (for baking)\n• 1/4 cup mashed banana = 1 egg (for baking)\n• 1 tablespoon ground flaxseed + 3 tablespoons water = 1 egg\n• 1/4 cup silken tofu = 1 egg\n• 1/4 cup yogurt = 1 egg\n• Commercial egg replacers (follow package directions)\n\nNote: Substitutes work best in baking, not for dishes that rely on eggs for structure like omelets.";
    }
    
    if (lowerMessage.includes('roux')) {
      return "A roux is a mixture of equal parts fat and flour used to thicken sauces and soups:\n\n1. Melt butter or heat oil in a pan over medium heat\n2. Add an equal amount of flour (e.g., 2 tbsp butter + 2 tbsp flour)\n3. Cook while stirring constantly:\n   • White roux: 2-3 minutes (for white sauces)\n   • Blond roux: 5-6 minutes (for velouté)\n   • Brown roux: 8-10 minutes (for gumbo, darker sauces)\n4. Gradually whisk in liquid (milk, stock, etc.)\n5. Continue cooking until thickened";
    }
    
    if (lowerMessage.includes('chicken') && lowerMessage.includes('season')) {
      return "Here's how to season chicken perfectly:\n\n**Basic Seasoning:**\n• Salt and pepper (essential!)\n• Garlic powder and onion powder\n• Paprika for color and mild heat\n\n**Flavor Profiles:**\n• **Italian:** Basil, oregano, rosemary, thyme\n• **Mexican:** Cumin, chili powder, oregano, lime\n• **Asian:** Ginger, soy sauce, sesame oil, garlic\n• **Mediterranean:** Lemon, herbs de Provence, olive oil\n\n**Tips:**\n• Season generously - chicken needs more salt than you think\n• Let seasoned chicken rest 15-30 minutes before cooking\n• Season both sides and under the skin if possible";
    }
    
    if (lowerMessage.includes('onion') && lowerMessage.includes('cry')) {
      return "To prevent crying when cutting onions:\n\n**Before Cutting:**\n• Chill onions in the fridge for 30 minutes\n• Cut under running water (not recommended for precision)\n• Use a very sharp knife (dull knives crush more cells)\n• Wear contact lenses or swimming goggles\n\n**While Cutting:**\n• Cut near a fan or open window\n• Light a candle nearby (burns the sulfur compounds)\n• Chew gum or bread\n• Cut the root end last (contains most irritants)\n\n**Best Method:**\nCut off the top, peel, then cut in half from top to bottom. Lay flat and make horizontal cuts, then vertical cuts. This minimizes cell damage.";
    }
    
    if (lowerMessage.includes('baking soda') || lowerMessage.includes('baking powder')) {
      return "**Baking Soda vs Baking Powder:**\n\n**Baking Soda (Sodium Bicarbonate):**\n• Single-acting (reacts immediately with acid)\n• Requires acidic ingredients (buttermilk, yogurt, vinegar, lemon juice)\n• Use 1/4 teaspoon per cup of flour\n• Creates carbon dioxide bubbles for rise\n\n**Baking Powder:**\n• Double-acting (reacts twice - when mixed and when heated)\n• Contains its own acid\n• Use 1 teaspoon per cup of flour\n• More forgiving in recipes\n\n**Key Difference:**\nBaking soda needs acid to work, baking powder doesn't. Never substitute 1:1!";
    }
    
    if (lowerMessage.includes('recipe') || lowerMessage.includes('suggest')) {
      const availableRecipes = state.recipes.length;
      if (availableRecipes === 0) {
        return "I'd love to suggest recipes, but you haven't added any to your collection yet! Try adding some recipes first, and then I can help you discover new dishes based on what you like to cook.";
      }
      
      const randomRecipe = state.recipes[Math.floor(Math.random() * state.recipes.length)];
      return `Based on your recipe collection, I'd recommend trying **${randomRecipe.name}**! It's a ${randomRecipe.difficulty.toLowerCase()} ${randomRecipe.cuisine} dish that takes ${randomRecipe.cookingTime} minutes to prepare. You have ${state.recipes.length} recipes in your collection - would you like me to suggest something specific based on ingredients or cooking time?`;
    }
    
    if (lowerMessage.includes('tip') || lowerMessage.includes('advice')) {
      const randomTip = COOKING_TIPS[Math.floor(Math.random() * COOKING_TIPS.length)];
      return `Here's a great cooking tip: **${randomTip}**\n\nWould you like more tips on a specific cooking technique or ingredient?`;
    }
    
    // Default response
    return "That's an interesting question! I'm here to help with cooking techniques, recipe suggestions, ingredient substitutions, and general cooking advice. Could you be more specific about what you'd like to know? I can help with things like:\n\n• Cooking techniques and methods\n• Ingredient substitutions\n• Recipe suggestions from your collection\n• Cooking tips and tricks\n• Troubleshooting cooking problems";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(userMessage.text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      Alert.alert('Error', 'Sorry, I encountered an error. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
    // Auto-send the question
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <View style={styles.messageContent}>
              {!message.isUser && (
                <Avatar.Icon
                  size={32}
                  icon="robot"
                  style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
                />
              )}
              <Card
                style={[
                  styles.messageCard,
                  message.isUser
                    ? [styles.userCard, { backgroundColor: theme.colors.primary }]
                    : [styles.aiCard, { backgroundColor: theme.colors.surface }],
                ]}
              >
                <Card.Content style={styles.messageText}>
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.messageTextContent,
                      message.isUser && { color: theme.colors.onPrimary },
                    ]}
                  >
                    {message.text}
                  </Text>
                </Card.Content>
              </Card>
              {message.isUser && (
                <Avatar.Icon
                  size={32}
                  icon="account"
                  style={[styles.avatar, { backgroundColor: theme.colors.secondary }]}
                />
              )}
            </View>
            <Text variant="caption" style={styles.timestamp}>
              {formatTime(message.timestamp)}
            </Text>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={styles.messageContent}>
              <Avatar.Icon
                size={32}
                icon="robot"
                style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
              />
              <Card style={[styles.messageCard, styles.aiCard, { backgroundColor: theme.colors.surface }]}>
                <Card.Content style={styles.typingIndicator}>
                  <Text variant="bodyMedium">AI is typing...</Text>
                </Card.Content>
              </Card>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <View style={styles.quickQuestions}>
          <Text variant="bodyMedium" style={styles.quickTitle}>
            Try asking me about:
          </Text>
          <View style={styles.quickChips}>
            {QUICK_QUESTIONS.map((question, index) => (
              <Chip
                key={index}
                onPress={() => handleQuickQuestion(question)}
                style={styles.quickChip}
                textStyle={{ fontSize: 12 }}
              >
                {question}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          placeholder="Ask me anything about cooking..."
          value={inputText}
          onChangeText={setInputText}
          style={styles.textInput}
          multiline
          maxLength={500}
          right={
            <TextInput.Icon
              icon="send"
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
            />
          }
          onSubmitEditing={handleSendMessage}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  avatar: {
    marginHorizontal: 8,
  },
  messageCard: {
    maxWidth: '100%',
  },
  userCard: {
    borderBottomRightRadius: 4,
  },
  aiCard: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  messageTextContent: {
    lineHeight: 20,
  },
  typingIndicator: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  timestamp: {
    marginTop: 4,
    opacity: 0.6,
    textAlign: 'center',
  },
  quickQuestions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  quickTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  quickChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickChip: {
    marginBottom: 4,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  textInput: {
    backgroundColor: 'white',
  },
}); 