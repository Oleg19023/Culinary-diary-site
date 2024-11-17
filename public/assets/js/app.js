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

// Отменить добавление блюда
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
}

// Обработчик для установки рейтинга
document.querySelectorAll('.star').forEach((star) => {
    star.addEventListener('click', function () {
        const ratingValue = parseInt(this.getAttribute('data-value'));
        setRating(ratingValue);
    });
});


// Функция для создания карточки блюда
function createDishCard(dishData) {
    const dishCard = document.createElement('div');
    dishCard.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-4');

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
    recipeButton.textContent = 'Переглянути рецепт';

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

    dishCard.appendChild(card);
    return dishCard;
}

// Глобальная переменная для хранения текущего рейтинга
let currentDifficulty = 1;

// Сохранить данные нового блюда и вывести в консоль
function saveNewDish() {
    const name = document.getElementById('dishName').value;
    const description = document.getElementById('dishDescription').value;
    const imageFile = document.getElementById('dishImage').files[0]; // Получаем файл изображения

    if (!name || !description || !imageFile) {
        alert('Будь ласка, заповніть всі поля!');
        return;
    }

    // Получаем имя файла изображения
    const imageUrl = `./assets/images/${imageFile.name}`;

    // Создаём объект блюда
    const newDish = {
        name: name,
        description: description,
        imageUrl: imageUrl, // Используем имя файла изображения
        difficulty: currentDifficulty, // Используем текущее значение сложности
    };

    // Выводим готовый JSON в консоль
    console.log(JSON.stringify(newDish, null, 2));

    // Отображаем сообщение на экране
    alert('Страва була створена у форматі JSON. Дивіться консоль для отримання готового JSON.');

    // Добавляем карточку с новым блюдом на страницу
    document.querySelector('.row.g-3').appendChild(createDishCard(newDish));

    // Скрываем форму
    cancelAddDish();
}

// Привязать функцию saveNewDish к кнопке "Зберегти"
document.getElementById('saveDishBtn').addEventListener('click', saveNewDish);

// Обработчик для установки рейтинга
document.querySelectorAll('.star').forEach((star) => {
    star.addEventListener('click', function () {
        const ratingValue = parseInt(this.getAttribute('data-value'));
        currentDifficulty = ratingValue; // Обновляем глобальную переменную для сложности

        setRating(ratingValue); // Обновление рейтинга

        // Сохраняем выбранный рейтинг в глобальной переменной или в поле
        const starsList = document.querySelectorAll('.star');
        starsList.forEach(star => star.classList.remove('selected')); // Убираем класс 'selected' с других звезд
        for (let i = 0; i < ratingValue; i++) {
            starsList[i].classList.add('selected'); // Добавляем класс 'selected' на нужное количество звезд
        }
    });
});

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




