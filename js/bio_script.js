Lifunction botTyping(time, timeE) {
  var messageContainer = document.getElementById("messageContainer");

  // Создаем блок с анимацией кругов
  var typingBlock = document.createElement("div");
  typingBlock.classList.add("bot-typing");
  typingBlock.innerHTML = `
    <div class="dot-container">
      <div class="dot dot1"></div>
      <div class="dot dot2"></div>
      <div class="dot dot3"></div>
    </div>
  `;

setTimeout(function(){
messageContainer.appendChild(typingBlock)
}, time) 

  // Удаляем блок с анимацией после таймаута
  setTimeout(function() {
    messageContainer.removeChild(typingBlock);
    saveChat();
  }, time + time);
}

function botAnswer(message, time, bool) {
if (bool !== false) {
  botTyping(1000, time);
}
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
  }, time + 1000);
}


function sendMessage(content) {
  var messageInput = content || document.getElementById("messageInput");
  console.log(content)
  var messageContent = content === undefined ? messageInput.value.trim() : content
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
    if (messageContent == "/цены" || messageContent == "/price") {
      botAnswer("Экономика — Договорная;<br>Ваше ТЗ — Договорная;<br>Модерация — от 300₽;<br>Музыка — от 300₽;<br>Баннер — от 200₽;<br>Логирование — от 300₽;<br>Автороли — от 300₽;<br>Тикеты — от 300₽;<br>Верификация — от 200₽;<br><s>ChatGPT — от 200₽.</s>", 2000);
    } else if (messageContent === "/связь" ||  messageContent === "/contact") {
      botAnswer("**Telegram:** va1les_tg<br>**Discord:** va1les", 2000)
    } else if (messageContent === "/донат" || messageContent === "/donate") {
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
        , 2000)
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

function getCommandFromURL() {
  const urlParams = new URLSearchParams(window.location.hash.substring(1));
  return urlParams.get('cmd');
}

function processCommandFromURL(time) {
  const command = getCommandFromURL();
  window.location.hash = '';
  setTimeout(() => {
    if (command == null) return;
    sendMessage("/" + command)
  }, time);
}

window.addEventListener("DOMContentLoaded", function () {
  time = 1500
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
    time += 3000
    botAnswer(
      "Привет! Меня зовут Паша, мне 16 лет. Я разработчик ботов для Discord. Готов создать бота на заказ по доступной цене. Свяжитесь со мной, если вам нужна помощь или бот для вашего сервера Discord.",
      2000, false
    );

    botAnswer(
      "**Команды чат-бота:** <br>/цены<br>/связь<br>/донат</a>",
      3000, false
    );

    saveChat();
  }

  var messageInput = document.getElementById("messageInput");
  messageInput.focus();
  processCommandFromURL(time)
});
