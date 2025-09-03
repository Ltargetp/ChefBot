import telebot
import json
import random
from telebot.types import ReplyKeyboardMarkup, KeyboardButton

# ==================== НАСТРОЙКИ ====================
BOT_TOKEN = "ВАШ_ТОКЕН_ОТ_BOTFATHER"  # ← ЗАМЕНИТЕ ЭТО!
# ==================================================

bot = telebot.TeleBot(BOT_TOKEN)

# ==================== БАЗА РЕЦЕПТОВ ====================
RECIPES = {
    "Кето десерты": [
        {
            "name": "🍫 Шоколадные кето-маффины",
            "calories": 180,
            "ingredients": "миндальная мука, какао, яйца, кокосовое масло, эритрит",
            "instructions": "Смешайте все ингредиенты. Выпекайте 20 минут при 180°C.",
            "partner_link": "https://ru.iherb.com/search?kw=almond+flour&rcode=KAL0606"
        },
        {
            "name": "🧀 Кето-чизкейк без выпечки", 
            "calories": 220,
            "ingredients": "сливочный сыр, миндальная мука, сливки, лимонный сок, стевия",
            "instructions": "Смешайте основу из муки и масла. Приготовьте крем. Охладите 4 часа.",
            "partner_link": "https://ru.iherb.com/search?kw=cream+cheese&rcode=KAL0606"
        },
        {
            "name": "🥥 Кокосовые трюфели",
            "calories": 150,
            "ingredients": "кокосовая стружка, кокосовое масло, какао, стевия",
            "instructions": "Смешайте ингредиенты. Сформируйте шарики. Охладите 1 час.",
            "partner_link": "https://ru.iherb.com/search?kw=coconut+flour&rcode=KAL0606"
        }
    ],
    "Здоровые завтраки": [
        {
            "name": "🥑 Авокадо-тост с яйцом",
            "calories": 320,
            "ingredients": "хлеб, авокадо, яйца, соль, перец, лимонный сок",
            "instructions": "Приготовьте тост. Разомните авокадо. Добавьте яйцо-пашот.",
            "partner_link": "https://ru.iherb.com/search?kw=avocado+oil&rcode=KAL0606"
        },
        {
            "name": "🍓 Греческий йогурт с ягодами",
            "calories": 180,
            "ingredients": "греческий йогурт, ягоды, мед, орехи",
            "instructions": "Смешайте йогурт с ягодами. Добавьте мед и орехи.",
            "partner_link": "https://ru.iherb.com/search?kw=greek+yogurt&rcode=KAL0606"
        }
    ]
}

# ==================== КЛАВИАТУРЫ ====================
def main_keyboard():
    keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
    keyboard.add(KeyboardButton("🍽️ Найти рецепты"))
    keyboard.add(KeyboardButton("⭐ Избранное"))
    keyboard.add(KeyboardButton("🛒 Список покупок"))
    keyboard.add(KeyboardButton("💰 Партнерские продукты"))
    return keyboard

def categories_keyboard():
    keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
    keyboard.add(KeyboardButton("🍫 Кето десерты"))
    keyboard.add(KeyboardButton("🥑 Здоровые завтраки")) 
    keyboard.add(KeyboardButton("🔙 Назад"))
    return keyboard

# ==================== КОМАНДЫ БОТА ====================
@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.reply_to(message, 
        "🍃 *Добро пожаловать в NutriChefBot!*\n\n"
        "Я помогу вам найти полезные рецепты и продукты!\n\n"
        "Выберите действие:",
        parse_mode='Markdown', 
        reply_markup=main_keyboard()
    )

@bot.message_handler(commands=['help'])
def send_help(message):
    bot.reply_to(message,
        "📋 *Доступные команды:*\n\n"
        "/start - начать работу\n"
        "/help - помощь\n"
        "/recipes - все рецепты\n\n"
        "Или используйте кнопки меню!",
        parse_mode='Markdown'
    )

# ==================== ОБРАБОТКА СООБЩЕНИЙ ====================
@bot.message_handler(func=lambda message: True)
def handle_message(message):
    try:
        if message.text == "🍽️ Найти рецепты":
            bot.send_message(message.chat.id, "Выберите категорию:", reply_markup=categories_keyboard())
        
        elif message.text == "🍫 Кето десерты":
            send_recipes(message, "Кето десерты")
            
        elif message.text == "🥑 Здоровые завтраки":
            send_recipes(message, "Здоровые завтраки")
            
        elif message.text == "💰 Партнерские продукты":
            send_partner_info(message)
            
        elif message.text == "🔙 Назад":
            bot.send_message(message.chat.id, "Главное меню:", reply_markup=main_keyboard())
            
        else:
            bot.reply_to(message, "Используйте кнопки меню или команды! 😊")
            
    except Exception as e:
        bot.reply_to(message, "❌ Произошла ошибка. Попробуйте позже.")

# ==================== ФУНКЦИИ ====================
def send_recipes(message, category):
    if category in RECIPES:
        recipes = RECIPES[category]
        for recipe in recipes[:3]:  # Показываем первые 3 рецепта
            response = (
                f"*{recipe['name']}* ({recipe['calories']} ккал)\n\n"
                f"🍴 *Ингредиенты:*\n{recipe['ingredients']}\n\n"
                f"📝 *Приготовление:*\n{recipe['instructions']}\n\n"
                f"🛒 *Продукты:* [iHerb]({recipe['partner_link']})"
            )
            bot.send_message(message.chat.id, response, parse_mode='Markdown')
    else:
        bot.send_message(message.chat.id, "Рецепты не найдены 😢")

def send_partner_info(message):
    text = (
        "🛒 *Партнерские продукты:*\n\n"
        "• iHerb - скидка 10% по коду *KAL0606*\n"
        "• MyProtein - спортивное питание\n"
        "• Local Farmers - свежие продукты\n\n"
        "Поддержите бота, покупая по нашим ссылкам! 💚"
    )
    bot.send_message(message.chat.id, text, parse_mode='Markdown')

# ==================== ЗАПУСК БОТА ====================
if __name__ == "__main__":
    print("🤖 Бот запущен! Остановите сочетанием Ctrl+C")
    bot.polling(none_stop=True)
