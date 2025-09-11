import telebot
import json
import os
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton

# Настройки бота
bot = telebot.TeleBot("7052018238:AAEhxM9rw-V7O7DFBExRQ24egAneOPBZO5U")  

# Загрузка рецептов
with open('recipes.json', 'r', encoding='utf-8') as f:
    recipes = json.load(f)

# Основное меню
def main_menu_keyboard():
    keyboard = InlineKeyboardMarkup(row_width=2)
    
    keyboard.add(
        InlineKeyboardButton("🥗 Salads", callback_data="category_salad"),
        InlineKeyboardButton("🔍 Search Ingredients", callback_data="search_ingredients")
    )
    keyboard.add(
        InlineKeyboardButton("🍗 Chicken Recipes", callback_data="category_chicken"),
        InlineKeyboardButton("🐟 Fish & Seafood", callback_data="category_fish")
    )
    keyboard.add(
        InlineKeyboardButton("📉 Low Calorie", callback_data="category_lowcal"),
        InlineKeyboardButton("📊 Nutrition Info", callback_data="nutrition_info")
    )
    keyboard.add(
        InlineKeyboardButton("🥦 Vegetable Dishes", callback_data="category_vegetable"),
        InlineKeyboardButton("🌱 Vegetarian", callback_data="category_vegetarian")
    )
    keyboard.add(
        InlineKeyboardButton("⭐ My Favorites", callback_data="favorites"),
        InlineKeyboardButton("📅 Daily Plan", callback_data="daily_plan")
    )
    keyboard.add(
        InlineKeyboardButton("👤 My Profile", callback_data="profile"),
        InlineKeyboardButton("❓ Help", callback_data="help")
    )
    
    return keyboard

# Обработчики команд
@bot.message_handler(commands=['start'])
def send_welcome(message):
    welcome_text = "🍽️ *Welcome to FitChefBot!* \n\nYour personal nutrition assistant with healthy recipes and meal plans!"
    bot.send_message(message.chat.id, welcome_text, 
                    parse_mode='Markdown', 
                    reply_markup=main_menu_keyboard())

@bot.message_handler(commands=['recipes'])
def send_all_recipes(message):
    recipes_text = "📚 *All Available Recipes:*\n\n"
    for recipe in recipes:
        recipes_text += f"• {recipe['name']['en']} ({recipe['calories']} kcal)\n"
    
    bot.send_message(message.chat.id, recipes_text, parse_mode='Markdown')

# Обработка callback-запросов
@bot.callback_query_handler(func=lambda call: True)
def handle_query(call):
    if call.data.startswith('category_'):
        category = call.data.replace('category_', '')
        send_recipes_by_category(call.message, category)
    
    elif call.data == 'search_ingredients':
        bot.send_message(call.message.chat.id, "🔍 Please send me ingredients you have (comma-separated):")
    
    elif call.data == 'nutrition_info':
        bot.send_message(call.message.chat.id, "📊 Connect your Nutritionix account for detailed analysis...")
    
    elif call.data == 'favorites':
        bot.send_message(call.message.chat.id, "⭐ Your favorite recipes will appear here!")
    
    elif call.data == 'daily_plan':
        send_daily_plan(call.message)
    
    elif call.data == 'profile':
        send_user_profile(call.message)
    
    elif call.data == 'help':
        send_help_info(call.message)

# Функции бота
def send_recipes_by_category(message, category):
    category_recipes = [r for r in recipes if r['category'] == category]
    
    if not category_recipes:
        bot.send_message(message.chat.id, f"No recipes found in category: {category}")
        return
    
    for recipe in category_recipes[:3]:  # Показываем первые 3 рецепта
        recipe_text = f"""
🍽️ *{recipe['name']['en']}*
⚡ {recipe['calories']} kcal | 🕐 20 min

*Ingredients:*
{recipe['ingredients']['en']}

*Instructions:*
{recipe['instructions']['en']}

💡 *Pro Tip:* Use code KAL0606 on iHerb for 10% discount on ingredients!
        """
        
        bot.send_message(message.chat.id, recipe_text, parse_mode='Markdown')

def send_daily_plan(message):
    plan_text = """
📅 *Your Daily Nutrition Plan:*

🍳 *Breakfast:* Greek Yogurt with Berries (180 kcal)
🍲 *Lunch:* Grilled Salmon with Vegetables (350 kcal)  
🥗 *Dinner:* Chicken Caesar Salad (280 kcal)
🍎 *Snack:* Protein Smoothie (250 kcal)

✅ *Total: 1060 kcal*

Use code KAL0606 on iHerb for healthy ingredients!
    """
    
    bot.send_message(message.chat.id, plan_text, parse_mode='Markdown')

def send_user_profile(message):
    profile_text = """
👤 *Your Profile:*

🏆 Level: Nutrition Beginner
⭐ Favorite Recipes: 0
📊 Daily Calories: 1800-2000 kcal
🥗 Diet Type: Balanced

🔗 Connected Services:
• Nutritionix: Not connected
• iHerb: Ready for shopping!
    """
    
    bot.send_message(message.chat.id, profile_text, parse_mode='Markdown')

def send_help_info(message):
    help_text = """
❓ *FitChefBot Help:*

*/start* - Main menu
*/recipes* - Show all recipes

🔍 *Search:* Send ingredients you have
⭐ *Favorites:* Save recipes you love
📅 *Daily Plan:* Get personalized meal plan

🛒 *Shopping:* Use code KAL0606 on iHerb for 10% discount!

📞 Support: @GetAlexl
    """
    
    bot.send_message(message.chat.id, help_text, parse_mode='Markdown')

# Запуск бота
if __name__ == "__main__":
    print("🤖 FitChefBot is running...")
    bot.polling(none_stop=True)
