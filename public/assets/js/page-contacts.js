document.addEventListener("DOMContentLoaded", () => {
    const messageType = document.getElementById("messageType");
    const ratingContainer = document.getElementById("ratingContainer");
    const submitButton = document.getElementById("submitButton");

    // Функция для отображения/скрытия меню выбора оценки
    const toggleRatingVisibility = () => {
        if (messageType.value === "відгук") {
            ratingContainer.style.display = "block";
        } else {
            ratingContainer.style.display = "none";
        }
    };

    // Установить состояние выбора звезд при загрузке страницы
    toggleRatingVisibility();

    // Отслеживать изменение типа сообщения
    messageType.addEventListener("change", toggleRatingVisibility);

    // Обработка отправки формы
    submitButton.addEventListener("click", () => {
        const email = document.getElementById("email").value;
        const subject = document.getElementById("subject").value;
        const messageText = document.getElementById("messageText").value;
        const name = document.getElementById("name").value;
        const rating = messageType.value === "відгук" ? document.getElementById("rating").value : null;

        // Формирование данных для отправки
        const messageData = {
            email,
            subject,
            messageText,
            name,
            rating: rating ? `Оцінка: ${rating}` : null,
        };

        // Отправка данных (пример)
        console.log("Данные для отправки:", messageData);

        alert("Ваше повідомлення успішно відправлено!");
        document.getElementById("contactForm").reset();
        toggleRatingVisibility(); // Скрыть меню оценки после сброса формы
    });
});