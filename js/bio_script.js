function localStorageFunction() {
  const usedSpace = JSON.stringify(localStorage).length * 2;
  const currentStorageSize = usedSpace / (1024 * 1024); // перевод в Мб

  if (usedSpace >= 5 * 1024 * 1024) {
    console.warn("Локальное хранилище полное.");
    clearChat();
    toggleMenu();
    botAnswer(`<i class="fa fa-trash" aria-hidden="true"></i> Хранилище больше **5Mb**, чат был очищен.`, 1000, 0, 0, 2000, "Система")
  };

  console.log(`Текущий размер хранилища: ${currentStorageSize.toFixed(4)} Мб`);
}

const commandJson =
{
  "auto-poster": {
    text: `Auto Poster — полезный инструмент для автоматической отправки сообщений от вашего лица.<br><br><a class="messageA">https://discord.gg/SJK5uRqqEs</a> — официальный дискорд Auto Poster'а.<br><br><i class="fa fa-shopping-cart" aria-hidden="true"></i> 3 дня бесплатного использования — FREE3DAYS. <a class="small"></a>`,
    delay: 1000
  },
  "discord-bots": {
    text: `Экономика — Договорная;<br>Ваше ТЗ — Договорная;<br>Модерация — от 300₽;<br>Музыка — от 300₽;<br>Баннер — от 200₽;<br>Логирование — от 300₽;<br>Автороли — от 300₽;<br>Тикеты — от 300₽;<br>Верификация — от 200₽;<br><s>ChatGPT — от 200₽.</s>`,
    delay: 2000
  },
  contact: {
    text: `<i class="fab fa-telegram"></i> **Telegram:** va1les_tg<br><i class="fab fa-discord"></i> **Discord:** va1les`,
    delay: 1000
  },
  donate: {
    text: `**Вы можете поддержать меня!**<br><br><a class="sber">Sber:</a> 2202206703020607<br><a class="qiwi">Qiwi:</a> <a class="link" href="https://qiwi.com/n/VAILES" target="_blank">VAILES</a><br><a class="qiwi">DonationAlerts: </a><a class="link" href="https://www.donationalerts.com/r/va1les" target="_blank">Кликабельно</a><br>`,
    delay: 1000
  }
};

let prefix = '/';
let cmds = ['auto-poster', 'discord-bots', 'contact', 'donate'];

function botTyping(typing_time, answer_time) {
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
  }, typing_time)

  setTimeout(function () {
    messageContainer.removeChild(typingBlock);
  }, typing_time + answer_time);
}

function botAnswer(message, answer_time, typing_time, start, delete_message, username) {
  setTimeout(() => {
    botTyping(typing_time, answer_time);

    setTimeout(function () {
      document.getElementById("messageSound").play();
      let messageContainer = document.getElementById("messageContainer");
      let messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.classList.add("bot-message");
      let userElement = document.createElement("div");
      userElement.classList.add("user");
      userElement.textContent = username || "! va1les";
      messageElement.appendChild(userElement);
      let contentElement = document.createElement("div");
      contentElement.classList.add("content");
      contentElement.innerHTML = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      messageElement.appendChild(contentElement);
      messageContainer.appendChild(messageElement);
      messageContainer.scrollTop = messageContainer.scrollHeight;
      if (delete_message > 0) {
        setTimeout(() => {
          messageContainer.removeChild(messageElement);;
        }, delete_message);
      } else {
      };
    }, answer_time + typing_time);
  }, start);
}


function sendMessage(content) {
  let random = Math.round(Math.random() * 100);
  let messageInput = content || document.getElementById("messageInput");
  let messageContent = content === undefined ? messageInput.value.trim() : content;
  if (messageContent.length > 2000) {
    messageInput.value = "";
    return botAnswer("Ваше сообщение не было отправлено.", 1000, 0, 0, 2000, "Система");
  } else if (messageContent !== "") {
    if (random <= 10) {
      botAnswer(`<i class="fa fa-music link"></i> <a class="link" href="https://va1les.ru/pitch" target="_blank">https://va1les.ru/pitch</a><br><i class="fas fa-clock link"></i> <a class="link" href="https://va1les.ru/timer" target="_blank">https://va1les.ru/timer</a>`, 0, 0, 0, 8000, "Система")
    }
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
        botAnswer(commandJson[command].text, commandJson[command].delay, 500);
      } else {
        botAnswer('<i class="fas fa-times error-text"></i> Команда не найдена.', 0, 0, 0, 3000, "Система");
      }
    }
  };
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
  localStorageFunction();
}

function clearSavedChat() {
  localStorage.removeItem("chatMessages");
  localStorageFunction();
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
  let time = 3000
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
    time += 1500
    botAnswer(
      `Привет! Меня зовут Паша, мне 16 лет. Я разработчик ботов для Discord. Готов помочь с созданием бота для вашего сервера.`,
      1000,
      1000,
      0
    );

    const userInfo = document.querySelector('.user-info');

    userInfo.addEventListener('click', function () {
      showPopup()
    });

    botAnswer(
      `**Команды чат-бота:** <br>
        ${cmds.map(cmd => `<a class="messageA" id="${cmd}">${prefix}${cmd}</a><br>`).join('')}`,
      1000,
      1000,
      1500
    );
  }
  let messageInput = document.getElementById("messageInput");
  messageInput.focus();
  processCommandFromURL(time)
})

function showPopup() {
  profilePopupContainer.style.display = 'flex';
}

function closePopup() {
  profilePopupContainer.style.display = 'none';
}

const observerOptions = {
  childList: true,
  subtree: true
};

function handleMutation(mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      saveChat()
    }
  }
}

const messageContainer = document.getElementById('messageContainer');
const observer = new MutationObserver(handleMutation);
observer.observe(messageContainer, observerOptions);

function removeMessagesByContentFromLocalStorage(content) {
  let chatMessages = localStorage.getItem("chatMessages");
  if (chatMessages) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(chatMessages, "text/html");
    const messages = doc.getElementsByClassName("message");
    const messagesToDelete = [];

    for (let i = messages.length - 1; i >= 0; i--) {
      const messageContent = messages[i].querySelector(".content").textContent;
      if (messageContent === content) {
        messagesToDelete.push(messages[i]);
      }
    }

    messagesToDelete.forEach(message => {
      message.remove();
    });

    localStorage.setItem("chatMessages", doc.body.innerHTML);
  }
}

removeMessagesByContentFromLocalStorage(' Команда не найдена.');
removeMessagesByContentFromLocalStorage(' https://va1les.ru/pitch https://va1les.ru/timer')
