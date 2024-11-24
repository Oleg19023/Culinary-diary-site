///////// <-Footer-JS-> ////////////

document.addEventListener("DOMContentLoaded", () => {
    // Функция для обновления времени и даты
    function updateTime() {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString("uk-UA"); // Формат для Украины (дд.мм.гггг)
        const formattedTime = currentDate.toLocaleTimeString("uk-UA"); // Формат времени (часы:минуты:секунды)

        // Обновляем только нужные элементы в футере
        document.getElementById("footerYear").textContent = currentDate.getFullYear();
        document.getElementById("footerDate").textContent = `Time: ${formattedDate}`;
        document.getElementById("footerTime").textContent = ` ${formattedTime}`;
    }

    // Изначально создаем футер с нужными элементами
    const footerHTML = `
        <footer>
            <p>© <span id="footerYear"></span> Українська Кухня. Всі права захищені.</p>
            <div class="footer-links">
                <a href="./page-inne.html">Про нас</a>
                <a href="./page-contacts.html">Контакти(Beta)</a>
                <a href="./page-privacy.html">Конфіденційність(Beta)</a>
            </div>
            <div>
                <div class="footer-bottom">
                    <div class="footer-admin-button">
                        <a href="./admin-admin.html" class="btn btn-secondary">
                            <i class="fas fa-cogs"></i> <!-- Иконка (например, шестеренка) -->
                        </a>
                    </div>
                    <h6 class="m-3">
                        Update v1.5 | <span id="footerDate"></span> | <span id="footerTime"></span>
                    </h6>
                </div>
            </div>
        </footer>
    `;

    // Добавляем футер в конец body
    document.body.insertAdjacentHTML("beforeend", footerHTML);

    // Обновляем время каждую секунду
    setInterval(updateTime, 1000);

    // Изначально вызываем функцию для первого отображения
    updateTime();
});


///////// <-Footer-JS-> ////////////