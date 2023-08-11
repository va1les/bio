function localStorageFunction() {
  const usedSpace = JSON.stringify(localStorage).length * 2;
  const currentStorageSize = JSON.stringify(localStorage).length;
  usedSpace >= 5 * 1024 * 1024 ? console.log("Локальное хранилище полное.") : console.log("Локальное хранилище еще есть место.")
  return console.log(`Текущий размер хранилища: ${currentStorageSize} байт (${(currentStorageSize / (1024 * 1024)).toFixed(4)} Мб)`);
}

isLocalStorageFull()

const commandJson =
{
  price: {
    text: `Экономика — Договорная;<br>Ваше ТЗ — Договорная;<br>Модерация — от 300₽;<br>Музыка — от 300₽;<br>Баннер — от 200₽;<br>Логирование — от 300₽;<br>Автороли — от 300₽;<br>Тикеты — от 300₽;<br>Верификация — от 200₽;<br><s>ChatGPT — от 200₽.</s>`,
    delay: 2000
  },
  contact: {
    text: `<i class="fab fa-telegram"></i> **Telegram:** va1les_tg<br><i class="fab fa-discord"></i> **Discord:** va1les`,
    delay: 1000
  },
  donate: {
    text: `**Вы можете поддержать меня!**<br><br><a class="sber">Sber:</a> 2202206703020607<br><a class="qiwi">Qiwi:</a> <a class="link" href="https://qiwi.com/n/VAILES" target="_blank">VAILES</a><br><a class="qiwi">DonationAlerts: </a><a class="link" href="https://www.donationalerts.com/r/va1les" target="_blank">Кликабельно</a><br>`,
    delay: 2000
  }
};

let prefix = '/';
let cmds = [
  'price',
  'contact',
  'donate',
];

function botTyping(time, timeE) {
  let messageContainer = document.getElementById("messageContainer");

  let typingBlock = document.createElement("div");
  typingBlock.classList.add("bot-typing");
  typingBlock.innerHTML = `
    <div class="dot-container">
      <div class="dot dot1"></div>
      <div class="dot dot2"></div>
      <div class="dot dot3"></div>
    </div>
  `;

  setTimeout(function () {
    messageContainer.appendChild(typingBlock)
  }, time)

  setTimeout(function () {
    messageContainer.removeChild(typingBlock);
    saveChat();
  }, timeE + time);
}

function botAnswer(message, time, bool) {
  if (bool !== false) {
    botTyping(1000, time);
  }

  setTimeout(function () {
    document.getElementById("messageSound").play();
    let messageContainer = document.getElementById("messageContainer");
    let messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.classList.add("bot-message");
    let userElement = document.createElement("div");
    userElement.classList.add("user");
    userElement.textContent = "! va1les";
    messageElement.appendChild(userElement);
    let contentElement = document.createElement("div");
    contentElement.classList.add("content");
    contentElement.innerHTML = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    messageElement.appendChild(contentElement);
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;

    saveChat();
  }, time + 1000);
}


function sendMessage(content) {
  let messageInput = content || document.getElementById("messageInput");
  let messageContent = content === undefined ? messageInput.value.trim() : content
  if (messageContent !== "") {
    let messageContainer = document.getElementById("messageContainer");
    let userMessageElement = document.createElement("div");
    userMessageElement.classList.add("message");
    userMessageElement.classList.add("user-message");
    let userElement = document.createElement("div");
    userElement.classList.add("user");
    userElement.textContent = "Вы";
    userMessageElement.appendChild(userElement);
    let contentElement = document.createElement("div");
    contentElement.classList.add("content");
    contentElement.innerHTML = messageContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    userMessageElement.appendChild(contentElement);
    messageContainer.appendChild(userMessageElement);
    messageInput.value = "";
    messageContainer.scrollTop = messageContainer.scrollHeight;
    document.getElementById("messageSound").play().catch(() => { return; })

    if (messageContent.startsWith(prefix)) {
      const command = messageContent.slice(prefix.length).trim();
      if (cmds.includes(command)) {
        botAnswer(commandJson[command].text, commandJson[command].delay);
      } else {
        botAnswer('<i class="fas fa-times"></i> Команда не найдена.', 1000);
      }
    }
  };

  saveChat();
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
    event.preventDefault();
  }
}

function toggleMenu() {
  let menuOverlay = document.getElementById("menuOverlay");
  menuOverlay.style.display = menuOverlay.style.display === "block" ? "none" : "block";
}

function clearChat(bool) {
  let messageContainer = document.getElementById("messageContainer");
  messageContainer.innerHTML = "";
  if (bool !== false) toggleMenu();

  clearSavedChat();
}

function saveChat() {
  let messageContainer = document.getElementById("messageContainer");
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
  time = 3000
  let loaderContainer = document.querySelector(".loader-container");

  setTimeout(function () {
    loaderContainer.classList.add("fade-out");
  }, 1000);

  setTimeout(function () {
    loaderContainer.style.display = "none";
  }, 1500);
  let savedChatMessages = localStorage.getItem("chatMessages");
  if (savedChatMessages) {
    let messageContainer = document.getElementById("messageContainer");
    messageContainer.innerHTML = savedChatMessages;
  } else {
    time += 3000
    botAnswer(
      `Привет! Меня зовут Паша, мне 16 лет. Я разработчик ботов для Discord. Готов помочь с созданием бота для вашего сервера.`,
      1000,
    );

    setTimeout(() => {
      botAnswer(
        `**Команды чат-бота:** <br>
        ${cmds.map(cmd => `<a class="messageA" id="${cmd}">${prefix}${cmd}</a><br>`).join('')}`,
        2000
      );
    }, 2000);
    saveChat();
  }

  let messageInput = document.getElementById("messageInput");
  messageInput.focus();
  processCommandFromURL(time)

  const userInfo = document.querySelector('.user-info');

  userInfo.addEventListener('click', function () {
    showPopup()
  });
});

function showPopup() {
  profilePopupContainer.style.display = 'flex';
}

function closePopup() {
  profilePopupContainer.style.display = 'none';
}
