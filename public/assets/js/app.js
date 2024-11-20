document.addEventListener('DOMContentLoaded', loadDishesFromJSON);

// Функция для применения темы
function applyTheme(theme) {
    let body = document.body;
    let navbar = document.querySelector('.navbar');
    let header = document.querySelector('header');
    let navLinks = document.querySelectorAll('.nav-link');
    let navbarBrandIcon = document.querySelector('.navbar-brand i');
    let searchButton = document.getElementById('searchButton');
    let cardBodies = document.querySelectorAll('.card-body');
    let themeIcon = document.getElementById('themeIcon');

    if (!themeIcon) {
        console.error('Theme icon not found');
        return;
    }

    if (theme === 'dark') {
        body.classList.add('dark-theme');
        if (navbar) navbar.classList.add('dark-theme-navbar');
        if (header) header.classList.add('dark-theme-header');
        navLinks.forEach(navLink => navLink.classList.add('dark-theme-text'));
        if (navbarBrandIcon) navbarBrandIcon.classList.add('dark-theme-icon');
        if (searchButton) searchButton.classList.add('dark-theme-button');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        body.classList.remove('dark-theme');
        if (navbar) navbar.classList.remove('dark-theme-navbar');
        if (header) header.classList.remove('dark-theme-header');
        navLinks.forEach(navLink => navLink.classList.remove('dark-theme-text'));
        if (navbarBrandIcon) navbarBrandIcon.classList.remove('dark-theme-icon');
        if (searchButton) searchButton.classList.remove('dark-theme-button');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    // Обновление стилей карточек
    cardBodies.forEach(cardBody => cardBody.classList.toggle('card-body-theme', theme === 'dark'));
}

// Проверка темы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
});

// Сохранение и переключение темы
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
}

// Переменная для отслеживания состояния поиска
let searchVisible = false;

// Получаем элементы
const searchToggle = document.getElementById('searchToggle');
const searchInput = document.getElementById('searchInput');

if (searchToggle && searchInput) {
    // Слушаем нажатие на кнопку поиска
    searchToggle.addEventListener('click', function() {
        if (!searchVisible) {
            searchInput.style.display = 'block';  // Показываем поле
            searchInput.focus();  // Ставим фокус на поле
            searchToggle.classList.add('active');  // Добавляем класс активности к кнопке
        } else {
            searchInput.style.display = 'none';  // Скрываем поле
            searchToggle.classList.remove('active');  // Убираем класс активности с кнопки
        }
        searchVisible = !searchVisible;  // Меняем состояние
    });
}

// Фильтрация блюд при вводе в поле поиска
if (searchInput) {
    searchInput.addEventListener('input', function() {
        let filter = this.value.toLowerCase().trim(); // Получаем значение поиска и удаляем лишние пробелы
        let cards = document.querySelectorAll('.card'); // Получаем все карточки блюд
        let foundAny = false; // Переменная для отслеживания наличия совпадений

        cards.forEach(function(card) {
            // Проверяем, является ли карточка кнопкой добавления
            const isAddNewDishCard = card.querySelector('.fa-plus') !== null;
            if (isAddNewDishCard) {
                // Всегда отображаем карточку добавления нового блюда
                card.style.display = '';
            } else {
                let title = card.querySelector('.card-title').textContent.toLowerCase(); // Получаем название блюда
                const isVisible = title.includes(filter);
                card.style.display = isVisible ? '' : 'none'; // Показываем или скрываем карточку
                foundAny = foundAny || isVisible; // Устанавливаем флаг, что нашли хотя бы одну карточку
            }
        });

        // Если ничего не найдено, отображаем сообщение
        const cardContainer = document.querySelector('.row.g-3');
        let messageElement = document.getElementById('no-results'); // Получаем элемент для сообщения

        if (!messageElement) {
            // Создаем элемент для сообщения, если его нет
            messageElement = document.createElement('p');
            messageElement.id = 'no-results'; // Устанавливаем id для этого элемента
            messageElement.textContent = 'Нічого не знайдено.'; // Текст сообщения
            messageElement.style.display = 'none'; // Скрываем по умолчанию
            cardContainer.appendChild(messageElement); // Добавляем элемент в контейнер карточек
        }

        // Показываем или скрываем сообщение в зависимости от результатов поиска
        messageElement.style.display = foundAny ? 'none' : 'block';
    });
}











document.addEventListener('DOMContentLoaded', function() {
    // Получаем все кнопки лайка и "Дивитись рецепт"
    const likeButtons = document.querySelectorAll('.btn.bg-secondary-subtle');
    const headerLikeCount = document.getElementById('headerLikeCount');

    // Получаем все кнопки "Дивитись рецепт"
    const recipeButtons = document.querySelectorAll('.btn.bg-dark');

    // Обработчик для кнопок "Дивитись рецепт"
    recipeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем класс активности у всех кнопок
            recipeButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            // Добавляем класс активности к текущей кнопке
            button.classList.add('active');
        });
    });

    // Переменная для отслеживания состояния отображения только лайкнутых карточек
    let showingLiked = false;

    // Функция для загрузки состояния лайков из localStorage
    function loadLikeStates() {
        const likeStates = JSON.parse(localStorage.getItem('likedRecipes')) || {};
        likeButtons.forEach((button) => {
            const card = button.closest('.card');
            const cardTitle = card.querySelector('.card-title').textContent;

            // Проверяем, есть ли лайк для этой карточки
            if (likeStates[cardTitle]) {
                button.classList.add('red'); // Если лайкнута, добавляем класс "red"
            }
        });
        updateHeaderLikeCount(likeStates);

        // Проверяем состояние кнопки "Избранное"
        showingLiked = JSON.parse(localStorage.getItem('showingLiked')) || false;
        const showLikedButton = document.getElementById('showLiked');
        if (showingLiked) {
            showLikedButton.classList.add('active'); // Если кнопка активна, добавляем класс
        }
    }

    // Обновляем счетчик лайков в заголовке
    function updateHeaderLikeCount(likeStates) {
        const likeCount = Object.keys(likeStates).length;
        headerLikeCount.textContent = `${likeCount}`; // Обновляем текст в заголовке
    }

    // Обработчик события для кнопок лайка
    likeButtons.forEach((button) => {
        button.addEventListener('click', function() {
            const card = button.closest('.card');
            const cardTitle = card.querySelector('.card-title').textContent;
            const likeStates = JSON.parse(localStorage.getItem('likedRecipes')) || {};

            // Проверяем, если кнопка уже лайкнута
            if (button.classList.contains('red')) {
                button.classList.remove('red'); // Убираем класс "red"
                delete likeStates[cardTitle]; // Удаляем запись из объекта состояния лайков

                // Если показываем только лайкнутые, скрываем карточку
                if (showingLiked) {
                    card.style.display = 'none'; // Скрываем карточку
                }
            } else {
                button.classList.add('red'); // Добавляем класс "red"
                likeStates[cardTitle] = true; // Сохраняем лайк
            }

            // Обновляем состояние в localStorage
            localStorage.setItem('likedRecipes', JSON.stringify(likeStates));
            updateHeaderLikeCount(likeStates); // Обновляем состояние лайков в заголовке
        });
    });

    // Функция для отображения только лайкнутых карточек
    document.getElementById('showLiked').addEventListener('click', function () {
        let cards = document.querySelectorAll('.card');
        let likedRecipes = JSON.parse(localStorage.getItem('likedRecipes')) || {};

        showingLiked = !showingLiked; // Переключаем состояние отображения

        // Сохраняем состояние кнопки "Избранное" в localStorage
        localStorage.setItem('showingLiked', showingLiked);

        cards.forEach(card => {
            const isAddNewDishCard = card.querySelector('.fa-plus') !== null; // Определяем карточку добавления блюда
            const cardTitle = card.querySelector('.card-title') ? card.querySelector('.card-title').textContent : '';

            // Если показываем лайкнутые карточки
            if (showingLiked) {
                if (likedRecipes[cardTitle] || isAddNewDishCard) {
                    card.style.display = ''; // Показываем лайкнутую карточку или карточку добавления
                } else {
                    card.style.display = 'none'; // Скрываем нелайкнутую карточку
                }
            } else {
                card.style.display = ''; // Показываем все карточки
            }
        });

        // Меняем цвет сердечка в заголовке в зависимости от состояния
        const showLikedButton = document.getElementById('showLiked');
        if (showingLiked) {
            showLikedButton.classList.add('active'); // Добавляем класс "active"
        } else {
            showLikedButton.classList.remove('active'); // Убираем класс "active"
        }
    });

    // Загружаем состояния при загрузке страницы
    loadLikeStates(); // Загружаем состояния лайков
});













// Загрузка данных из файла JSON
async function loadDishesFromJSON() {
    try {
        const response = await fetch('./dishes.json');
        if (!response.ok) throw new Error('Ошибка загрузки JSON');
        const dishes = await response.json();
        renderDishes(dishes);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function createDishCard(dishData) {
    const dishCardWrapper = document.createElement('div');
    dishCardWrapper.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-4'); // Обертка с сеткой

    const card = document.createElement('div');
    card.classList.add('card', 'p-2', 'shadow', 'col');

    const dishImage = document.createElement('img');
    dishImage.src = dishData.imageUrl;
    dishImage.classList.add('card-img-top');
    dishImage.alt = dishData.name;

    const dishBody = document.createElement('div');
    dishBody.classList.add('card-body');

    const dishName = document.createElement('h5');
    dishName.classList.add('card-title');
    dishName.textContent = dishData.name;

    const difficulty = document.createElement('div');
    const difficultyTitle = document.createElement('p');
    difficultyTitle.innerHTML = `<b>Складність</b>`;
    difficulty.appendChild(difficultyTitle);

    for (let i = 0; i < 5; i++) {
        const star = document.createElement('i');
        if (i < dishData.difficulty) {
            star.classList.add('fa-solid', 'fa-star');
            star.style.color = '#ffae00f1';
        } else {
            star.classList.add('fa-regular', 'fa-star');
            star.style.color = '#ffae00f1';
        }
        difficulty.appendChild(star);
    }

    const dishDescription = document.createElement('div');
    const descriptionText = document.createElement('p');
    descriptionText.textContent = dishData.description;
    dishDescription.appendChild(descriptionText);

    const buttonContainer = document.createElement('div');

    const recipeButton = document.createElement('button');
    recipeButton.classList.add('btn', 'bg-dark', 'text-white');
    recipeButton.textContent = 'Дивитись рецепт';

    const likeButton = document.createElement('button');
    likeButton.classList.add('btn', 'bg-secondary-subtle', 'border-4', 'rounded');
    const likeIcon = document.createElement('i');
    likeIcon.classList.add('fa-solid', 'fa-heart');
    likeButton.appendChild(likeIcon);

    buttonContainer.appendChild(recipeButton);
    buttonContainer.appendChild(likeButton);

    card.appendChild(dishImage);
    card.appendChild(dishBody);
    dishBody.appendChild(dishName);
    dishBody.appendChild(difficulty);
    dishBody.appendChild(dishDescription);
    dishBody.appendChild(buttonContainer);

    dishCardWrapper.appendChild(card); // Вкладываем карточку в обертку
    return dishCardWrapper;
}



// Функция для показа и скрытия формы добавления блюда
function toggleAddDishForm() {
    const form = document.getElementById('addDishForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Скрыть форму добавления блюда
function cancelAddDish() {
    toggleAddDishForm(); // Закрыть форму
}

// Сохранение нового блюда
function saveNewDish() {
    const name = document.getElementById('dishName').value;
    const description = document.getElementById('dishDescription').value;
    const imageFile = document.getElementById('dishImage').files[0]; // Получаем файл изображения
    const difficulty = document.querySelector('.star-rating .selected') ? document.querySelector('.star-rating .selected').dataset.value : '1'; // Сложность

    if (!name || !description || !imageFile) {
        alert('Будь ласка, заповніть всі поля!');
        return;
    }

    // Создаём объект блюда
    const newDish = {
        name: name,
        description: description,
        imageUrl: URL.createObjectURL(imageFile), // Ссылка на изображение
        difficulty: parseInt(difficulty),
    };

    // Выводим JSON в консоль
    console.log('Готовий JSON для страви:', JSON.stringify(newDish, null, 2));

    // Добавляем карточку с новым блюдом на страницу
    addDishCardToPage(newDish);

    // Скрываем форму
    cancelAddDish();
}


// Отображение блюд на сайте
function renderDishes(dishes) {
    const dishContainer = document.getElementById('dishContainer');
    dishContainer.innerHTML = ''; // Очистить контейнер перед загрузкой

    Object.values(dishes).forEach((dishData) => {
        const dishCard = createDishCard(dishData);
        dishContainer.appendChild(dishCard);
    });
}


// Функция для добавления карточки блюда на страницу
function addDishCardToPage(dishData) {
    const dishCardWrapper = document.createElement('div');
    dishCardWrapper.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-4');

    const card = document.createElement('div');
    card.classList.add('card', 'p-2', 'shadow', 'col');

    const dishImage = document.createElement('img');
    dishImage.src = dishData.imageUrl;
    dishImage.classList.add('card-img-top');
    dishImage.alt = dishData.name;

    const dishBody = document.createElement('div');
    dishBody.classList.add('card-body');

    const dishName = document.createElement('h5');
    dishName.classList.add('card-title');
    dishName.textContent = dishData.name;

    const dishDescription = document.createElement('p');
    dishDescription.textContent = dishData.description;

    const difficulty = document.createElement('p');
    difficulty.textContent = `Складність: ${dishData.difficulty}`;

    card.appendChild(dishImage);
    card.appendChild(dishBody);
    dishBody.appendChild(dishName);
    dishBody.appendChild(dishDescription);
    dishBody.appendChild(difficulty);

    dishCardWrapper.appendChild(card);
    document.querySelector('.row.g-3').appendChild(dishCardWrapper); // Добавляем карточку в контейнер
}




// Показать форму для добавления блюда
function addNewDish() {
    document.getElementById('addDishForm').style.display = 'block';
    document.querySelector('.add-dish-btn').classList.add('d-none');
}

// Скрыть форму для добавления блюда
function cancelAddDish() {
    document.getElementById('addDishForm').style.display = 'none';
    document.querySelector('.add-dish-btn').classList.remove('d-none');
}

// Установить рейтинг с помощью звездочек
function setRating(stars) {
    const starsList = document.querySelectorAll('#starRating .star');
    starsList.forEach((star, index) => {
        if (index < stars) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
    currentDifficulty = stars; // Обновляем текущую сложность
}

// Обработчик клика на звездочки
document.querySelectorAll('#starRating .star').forEach(star => {
    star.addEventListener('click', function () {
        const ratingValue = parseInt(this.getAttribute('data-value'));
        setRating(ratingValue);
    });
});

// Выбор категории блюда
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        currentCategory = this.getAttribute('data-category');
    });
});













// Глобальні змінні
let currentDifficulty = 1;
let currentCategory = 'all'; // Категорія для фільтрації відображуваних страв
let activeCountry = 'all'; // Кухня для фільтрації відображуваних страв
let dishes = [];
let selectedDishCategory = 'all'; // Це буде категорія для створення нової страви
let selectedDishCuisine = 'all'; // Це буде кухня для нової страви

// Маппінг для кухонь і їхніх абревіатур
const cuisineMapping = {
    "Італійська кухня": "it",
    "Українська кухня": "ua",
    "Французька кухня": "fr",
    "Китайська кухня": "cn",
    "Іспанська кухня": "es",
    "Грузинська кухня": "ge", // Грузинська кухня
    "Японська кухня": "jp",  // Японська кухня
    // Додати інші кухні за необхідністю
};

// Відкриття форми додавання страви
function addNewDish() {
    document.getElementById('addDishForm').style.display = 'block';
}

// Закриття форми додавання страви
function cancelAddDish() {
    document.getElementById('addDishForm').style.display = 'none';
}

// Установка складності
document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('#starRating .star');
    stars.forEach(star => {
        star.addEventListener('click', function () {
            currentDifficulty = parseInt(this.getAttribute('data-value'));
            stars.forEach(s => s.classList.toggle('active', parseInt(s.getAttribute('data-value')) <= currentDifficulty));
        });
    });

    // Обробник для фільтрації по кнопках кухні для відображення страв
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function () {
            activeCountry = this.getAttribute('data-filter');
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterDishes();  // Перезавантажуємо страви з фільтром
        });
    });

    // Обробник для фільтрації по категоріях для відображення страв
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function () {
            currentCategory = this.getAttribute('data-category');
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterDishes();  // Перезавантажуємо страви з фільтром
        });
    });

    // Обробник для кнопок вибору категорії для створення нової страви
    document.querySelectorAll('.category-btn-create').forEach(button => {
        button.addEventListener('click', function () {
            selectedDishCategory = this.getAttribute('data-category');  // Застосовуємо вибрану категорію тільки для нової страви
            document.querySelectorAll('.category-btn-create').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Обробник для вибору кухні при створенні нової страви
    document.getElementById('countrySelect').addEventListener('change', function() {
        selectedDishCuisine = this.value;  // Оновлюємо вибрану кухню
    });
});

// Збереження нової страви
function saveNewDish() {
    const name = document.getElementById('dishName').value.trim();
    const description = document.getElementById('dishDescription').value.trim();
    const imageFile = document.getElementById('dishImage').files[0];

    // Перевірка на заповненість полів
    if (!name || !description || !imageFile) {
        alert('Будь ласка, заповніть всі поля: назву, опис та завантажте зображення.');
        return;  // Перериваємо виконання функції, якщо поля не заповнені
    }

    // Отримуємо шлях до зображення
    const imageUrl = './assets/images/' + imageFile.name;

    // Заміна на абревіатуру з маппінгу
    const cuisineFlag = cuisineMapping[selectedDishCuisine] || selectedDishCuisine.toLowerCase();

    const newDish = {
        name,
        description,
        imageUrl,
        difficulty: currentDifficulty,
        category: selectedDishCategory, // Використовуємо вибрану категорію для нової страви
        cuisineName: selectedDishCuisine, // Використовуємо вибрану кухню для нової страви
        cuisineFlag, // Використовуємо абревіатуру кухні
    };

    // Виведення JSON в консоль
    console.log(JSON.stringify(newDish, null, 2));

    dishes.push(newDish);
    renderDishes(dishes);  // Відображаємо всі страви після додавання нової
    cancelAddDish();
    alert('Страва була створена. Дивіться консоль для JSON.');
}

// Завантаження страв з JSON
function loadDishesFromJSON() {
    fetch('./dishes.json')
        .then(response => response.json())
        .then(data => {
            dishes = data;
            renderDishes(dishes);  // Відображаємо всі страви при завантаженні
        })
        .catch(error => {
            alert('Помилка завантаження даних');
        });
}

// Фільтрація страв
function filterDishes() {
    const filteredDishes = dishes.filter(dish => {
        const categoryMatch = currentCategory === 'all' || dish.category === currentCategory;
        const countryMatch = activeCountry === 'all' || dish.cuisineName === activeCountry;
        return categoryMatch && countryMatch;
    });

    renderDishes(filteredDishes);
}

// Створення картки страви
function createDishCard(dishData) {
    const cardHtml = `
        <div class="col-12 col-sm-6 col-md-4 col-lg-4">
            <div class="card p-2 shadow h-100">
                <img src="${dishData.imageUrl}" alt="${dishData.name}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${dishData.name}</h5>
                    <p>Категорія: ${dishData.category}</p>
                    <p>
                        <span class="fi fi-${dishData.cuisineFlag} me-2"></span>
                        ${dishData.cuisineName}
                    </p>
                    <p>${dishData.description}</p>
                    <div class="d-flex">Складність:
                        ${Array(5).fill(0).map((_, i) => `
                            <i class="${i < dishData.difficulty ? 'fa-solid' : 'fa-regular'} fa-star" style="color: #ffae00f1"></i>
                        `).join('')}
                    </div>
                    <a href="./page-recepty.html" class="btn bg-dark text-white">Дивитись рецепт</a>
                    <button class="btn bg-secondary-subtle border-4 rounded">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>`;
    return cardHtml;
}

// Рендеринг страв
function renderDishes(dishesToRender) {
    const dishContainer = document.getElementById('dishContainer');
    dishContainer.innerHTML = dishesToRender.map(createDishCard).join('');
}

// Обробники подій
document.addEventListener('DOMContentLoaded', () => {
    loadDishesFromJSON();
    document.getElementById('saveDishBtn').addEventListener('click', saveNewDish);
});