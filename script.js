// Многоязычность
const translations = {
    ru: {
        search_placeholder: "Поиск рецептов...",
        filter_all: "Все",
        filter_breakfast: "Завтрак",
        filter_lunch: "Обед",
        filter_dinner: "Ужин",
        filter_dessert: "Десерт",
        no_recipes: "Рецепты не найдены",
        ingredients: "Ингредиенты",
        instructions: "Инструкции"
    },
    en: {
        search_placeholder: "Search recipes...",
        filter_all: "All",
        filter_breakfast: "Breakfast",
        filter_lunch: "Lunch",
        filter_dinner: "Dinner",
        filter_dessert: "Dessert",
        no_recipes: "No recipes found",
        ingredients: "Ingredients",
        instructions: "Instructions"
    },
    kz: {
        search_placeholder: "Рецептілерді іздеу...",
        filter_all: "Барлығы",
        filter_breakfast: "Таңертеңгі ас",
        filter_lunch: "Түскі ас",
        filter_dinner: "Кешкі ас",
        filter_dessert: "Десерт",
        no_recipes: "Рецепттер табылмады",
        ingredients: "Ингредиенттер",
        instructions: "Нұсқаулар"
    }
};

let currentLanguage = 'ru';
let currentFilter = 'all';
let currentSearch = '';

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
            btn.style.background = 'rgba(102, 126, 234, 0.8)';
            btn.style.color = 'white';
        } else {
            btn.style.background = 'rgba(102, 126, 234, 0.1)';
            btn.style.color = 'rgba(102, 126, 234, 0.8)';
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
            <h3>${recipe.title[currentLanguage] || recipe.title.ru}</h3>
            <p><strong>${translations[currentLanguage].ingredients}:</strong> ${recipe.ingredients[currentLanguage] || recipe.ingredients.ru}</p>
            <p><strong>${translations[currentLanguage].instructions}:</strong> ${recipe.instructions[currentLanguage] || recipe.instructions.ru}</p>
        </div>
    `).join('');
}

function getFilteredRecipes() {
    if (!window.recipesData) return [];
    
    return window.recipesData.filter(recipe => {
        const matchesCategory = currentFilter === 'all' || recipe.category === currentFilter;
        const matchesSearch = currentSearch === '' || 
            (recipe.title[currentLanguage] || recipe.title.ru).toLowerCase().includes(currentSearch) ||
            (recipe.ingredients[currentLanguage] || recipe.ingredients.ru).toLowerCase().includes(currentSearch);
        
        return matchesCategory && matchesSearch;
    });
}

// Загрузка рецептов
function loadRecipes() {
    fetch('recipes.json')
        .then(response => response.json())
        .then(data => {
            window.recipesData = data;
            renderRecipes();
        })
        .catch(error => {
            console.error('Error loading recipes:', error);
            document.getElementById('recipes-container').innerHTML = 
                `<p class="error">Ошибка загрузки рецептов</p>`;
        });
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
});
