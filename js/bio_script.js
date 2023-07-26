const http = require('http');
const url = require('url');

function botAnswer(message, time) {
  setTimeout(function () {
    document.getElementById("messageSound").play();
    var messageContainer = document.getElementById("messageContainer");
    var messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.classList.add("bot-message");
    var userElement = document.createElement("div");
    userElement.classList.add("user");
    userElement.textContent = "! va1les";
    messageElement.appendChild(userElement);
    var contentElement = document.createElement("div");
    contentElement.classList.add("content");
    contentElement.innerHTML = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    messageElement.appendChild(contentElement);
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;

    saveChat();
  }, time);
}

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  // Обрабатываем только GET запросы на путь '/bio'
  if (req.method === 'GET' && pathname === '/bio') {
    const command = query.cmd; // Получаем значение параметра 'cmd'

    // Если есть команда, добавляем ее в чат с префиксом "/цены"
    if (command) {
      botAnswer(`Вы ввели команду: /цены ${command}`, 1000);
    }
  }

  // Возвращаем успешный ответ на запрос
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Запрос обработан');
});

const port = 3000; // Порт, на котором будет запущен сервер
server.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

function sendMessage() {
  var messageInput = document.getElementById("messageInput");
  var messageContent = messageInput.value.trim();
  if (messageContent !== "") {
    var messageContainer = document.getElementById("messageContainer");
    var userMessageElement = document.createElement("div");
    userMessageElement.classList.add("message");
    userMessageElement.classList.add("user-message");
    var userElement = document.createElement("div");
    userElement.classList.add("user");
    userElement.textContent = "Вы";
    userMessageElement.appendChild(userElement);
    var contentElement = document.createElement("div");
    contentElement.classList.add("content");
    contentElement.innerHTML = messageContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    userMessageElement.appendChild(contentElement);
    messageContainer.appendChild(userMessageElement);
    messageInput.value = "";
    messageContainer.scrollTop = messageContainer.scrollHeight;
    document.getElementById("messageSound").play();
    if (messageContent === "/цены") {
      botAnswer("Экономика — Договорная;<br>Ваше ТЗ — Договорная;<br>Модерация — от 300₽;<br>Музыка — от 300₽;<br>Баннер — от 200₽;<br>Логирование — от 300₽;<br>Автороли — от 300₽;<br>Тикеты — от 300₽;<br>Верификация — от 200₽.<br>", 1000);
    } else if (messageContent === "/связь") {
      botAnswer("**Telegram:** va1les_tg<br>**Discord:** va1les", 1000)
    } else if (messageContent === "/донат") {
      botAnswer(`**Вы можете поддержать меня!**
<br><br>
<a class="sber">
Sber:</a> 2202206703020607
<br>
<a class="qiwi">
Qiwi:</a> <a class="link" href="https://qiwi.com/n/VAILES" target="_blank">VAILES</a>
<br>
<a class="qiwi">
DonationAlerts: </a><a class="link" href="https://www.donationalerts.com/r/va1les" target="_blank">Кликабельно</a><br>`
        , 1000)
    }

    saveChat();
  }
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
    event.preventDefault();
  }
}

function toggleMenu() {
  var menuOverlay = document.getElementById("menuOverlay");
  menuOverlay.style.display = menuOverlay.style.display === "block" ? "none" : "block";
}

function clearChat() {
  var messageContainer = document.getElementById("messageContainer");
  messageContainer.innerHTML = "";
  toggleMenu();

  clearSavedChat();
}

function saveChat() {
  var messageContainer = document.getElementById("messageContainer");
  localStorage.setItem("chatMessages", messageContainer.innerHTML);
}

function clearSavedChat() {
  localStorage.removeItem("chatMessages");
}

window.addEventListener("DOMContentLoaded", function () {
  var loaderContainer = document.querySelector(".loader-container");

  setTimeout(function () {
    loaderContainer.classList.add("fade-out");
  }, 1000);

  setTimeout(function () {
    loaderContainer.style.display = "none";
  }, 1500);

  var savedChatMessages = localStorage.getItem("chatMessages");
  if (savedChatMessages) {
    var messageContainer = document.getElementById("messageContainer");
    messageContainer.innerHTML = savedChatMessages;
  } else {
    botAnswer(
      "Привет! Меня зовут Паша, мне 16 лет. Я разработчик ботов для Discord. Готов создать бота на заказ по доступной цене. Свяжитесь со мной, если вам нужна помощь или бот для вашего сервера Discord.",
      2000
    );

    botAnswer(
      "**Команды чат-бота:** <br>/цены<br>/связь<br>/донат</a>",
      3000
    );

    saveChat();
  }

  var messageInput = document.getElementById("messageInput");
  messageInput.focus();
});
