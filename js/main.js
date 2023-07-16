function botAnswer(message, time) {
  setTimeout(function() {
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
    contentElement.textContent = message;
    messageElement.appendChild(contentElement);
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;

    saveChat();
  }, time);
}

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
    contentElement.textContent = messageContent;
    userMessageElement.appendChild(contentElement);
    messageContainer.appendChild(userMessageElement);
    messageInput.value = "";
    messageContainer.scrollTop = messageContainer.scrollHeight;
    document.getElementById("messageSound").play();
    if (messageContent === "цены") {
      botAnswer("текст не готов", 1000);
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

window.addEventListener("DOMContentLoaded", function() {
  var loaderContainer = document.querySelector(".loader-container");

  setTimeout(function() {
    loaderContainer.classList.add("fade-out");
  }, 1000);

  setTimeout(function() {
    loaderContainer.style.display = "none";
  }, 1500);

  var savedChatMessages = localStorage.getItem("chatMessages");
  if (savedChatMessages) {
    var messageContainer = document.getElementById("messageContainer");
    messageContainer.innerHTML = savedChatMessages;
  } else {
    botAnswer(
      "Привет! Я разрабатываю ботов на заказ, специализируясь на JavaScript. Мой опыт и навыки позволяют мне создавать ботов, которые отвечают требованиям клиентов и обеспечивают автоматизацию задач, модерацию серверов, взаимодействие с API и многое другое.",
      2000
    );

    botAnswer(
      "Если тебе нужен бот для Discord или других проектов, свяжись со мной. Я готов принять новые заказы и создать бота, который соответствует твоим потребностям и требованиям.",
      3000
    );

    saveChat();
  }

  var messageInput = document.getElementById("messageInput");
  messageInput.focus();
});
