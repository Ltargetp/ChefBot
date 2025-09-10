// Многоязычность
const translations = {
    ru: {
        search_placeholder: "Поиск рецептов...",
        filter_all: "Все",
        filter_keto: "Кето",
        filter_breakfast: "Завтраки",
        filter_salad: "Салаты",
        filter_main: "Основные",
        filter_dessert: "Десерты",
        no_recipes: "Рецепты не найдены",
        ingredients: "Ингредиенты",
        instructions: "Инструкции",
        buy_btn: "🛒 Купить продукты",
        save_recipe_btn: "⭐ Сохранить",
        calories_text: "ккал"
    },
    en: {
        search_placeholder: "Search recipes...",
        filter_all: "All",
        filter_keto: "Keto",
        filter_breakfast: "Breakfasts",
        filter_salad: "Salads",
        filter_main: "Main courses",
        filter_dessert: "Desserts",
        no_recipes: "No recipes found",
        ingredients: "Ingredients",
        instructions: "Instructions",
        buy_btn: "🛒 Buy products",
        save_recipe_btn: "⭐ Save",
        calories_text: "kcal"
    },
    de: {
        search_placeholder: "Rezepte suchen...",
        filter_all: "Alle",
        filter_keto: "Keto",
        filter_breakfast: "Frühstücke",
        filter_salad: "Salate",
        filter_main: "Hauptgerichte",
        filter_dessert: "Desserts",
        no_recipes: "Keine Rezepte gefunden",
        ingredients: "Zutaten",
        instructions: "Anleitung",
        buy_btn: "🛒 Produkte kaufen",
        save_recipe_btn: "⭐ Speichern",
        calories_text: "kcal"
    },
    fr: {
        search_placeholder: "Rechercher des recettes...",
        filter_all: "Tous",
        filter_keto: "Kéto",
        filter_breakfast: "Petits-déjeuners",
        filter_salad: "Salades",
        filter_main: "Plats principaux",
        filter_dessert: "Desserts",
        no_recipes: "Aucune recette trouvée",
        ingredients: "Ingrédients",
        instructions: "Instructions",
        buy_btn: "🛒 Acheter produits",
        save_recipe_btn: "⭐ Sauvegarder",
        calories_text: "kcal"
    }
};

let currentLanguage = 'ru';
let currentFilter = 'all';
let currentSearch = '';
let recipesData = [];

function changeLanguage(lang) {
    currentLanguage = lang;
    updateTranslations();
    renderRecipes();
    updateActiveLanguageButton();
}

function updateTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage][key]) {
            if (element.placeholder) {
                element.placeholder = translations[currentLanguage][key];
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });
}

function updateActiveLanguageButton() {
    document.querySelectorAll('.language-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Поиск и фильтры
function searchRecipes() {
    currentSearch = document.getElementById('search-input').value.toLowerCase();
    renderRecipes();
}

function filterRecipes(category) {
    currentFilter = category;
    renderRecipes();
    updateActiveFilterButton();
}

function updateActiveFilterButton() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === currentFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Отображение рецептов
function renderRecipes() {
    const recipesContainer = document.getElementById('recipes-container');
    const filteredRecipes = getFilteredRecipes();
    
    if (filteredRecipes.length === 0) {
        recipesContainer.innerHTML = `<p class="no-recipes">${translations[currentLanguage].no_recipes}</p>`;
        return;
    }
    
    recipesContainer.innerHTML = filteredRecipes.map(recipe => `
        <div class="recipe-card">
            <div class="recipe-image">${recipe.icon}</div>
            <h3 class="recipe-title">${recipe.name[currentLanguage] || recipe.name.ru}</h3>
            <div class="recipe-meta">
                <span class="recipe-calories">${recipe.calories} ${translations[currentLanguage].calories_text}</span>
                <span class="recipe-category">${recipe.category}</span>
            </div>
            <p class="recipe-ingredients"><strong>${translations[currentLanguage].ingredients}:</strong> ${recipe.ingredients[currentLanguage] || recipe.ingredients.ru}</p>
            <div class="recipe-actions">
                <button class="action-btn buy-btn">${translations[currentLanguage].buy_btn}</button>
                <button class="action-btn save-btn">${translations[currentLanguage].save_recipe_btn}</button>
            </div>
        </div>
    `).join('');
}

function getFilteredRecipes() {
    return recipesData.filter(recipe => {
        const matchesCategory = currentFilter === 'all' || recipe.category === currentFilter;
        const matchesSearch = currentSearch === '' || 
            (recipe.name[currentLanguage] || recipe.name.ru).toLowerCase().includes(currentSearch) ||
            (recipe.ingredients[currentLanguage] || recipe.ingredients.ru).toLowerCase().includes(currentSearch);
        
        return matchesCategory && matchesSearch;
    });
}

// Загрузка рецептов
async function loadRecipes() {
    try {
        const response = await fetch('recipes.json');
        recipesData = await response.json();
        renderRecipes();
    } catch (error) {
        console.error('Error loading recipes:', error);
        document.getElementById('recipes-container').innerHTML = 
            `<p class="error">Ошибка загрузки рецептов</p>`;
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Загрузка рецептов
    loadRecipes();
    
    // Инициализация переводов
    updateTranslations();
    updateActiveLanguageButton();
    updateActiveFilterButton();
    
    // Обработчики для кнопок языка
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            changeLanguage(this.getAttribute('data-lang'));
        });
    });
    
    // Обработчик для поиска (live search)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearch = e.target.value.toLowerCase();
            renderRecipes();
        });
    }
    
    // Обработчики для фильтров
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            filterRecipes(this.getAttribute('data-filter'));
        });
    });
    
    // Функция для сохранения предпочтений (заглушка)
    window.savePreferences = function() {
        alert('Настройки сохранены!');
    };
});
