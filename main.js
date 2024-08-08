// HTML'den gelenler
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");
let userText = null;

// Eleman oluşturma fonksiyonu
const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

// API'den gelen cevap
const getChatResponse = async (incomingChatDiv) => {
  const pElement = document.createElement("p");
  const url = "https://chatgpt-42.p.rapidapi.com/chatgpt";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "93a69c40a0mshff4c0e259dfe5b6p1087ffjsncd20470923d7",
      "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: `${userText}`,
        },
      ],
      temperature: 0.9,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 256,
      web_access: false,
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    pElement.innerText = data.result;
  } catch (error) {
    console.log(error);
    pElement.innerText = "Bir hata oluştu. Lütfen tekrar deneyin.";
  }

  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  chatInput.value = ""; // Input alanını boşalt
  saveChatHistory();
};

// Yazma animasyonu gösterme fonksiyonu
const showTypingAnimation = () => {
  const html = `
    <div class="chat-content">
      <div class="chat-details">
        <img src="./images/chatbot.jpg" alt="chatbot" />
        <div class="typing-animation">
          <div class="typing-dot" style="--delay: 0.2s"></div>
          <div class="typing-dot" style="--delay: 0.3s"></div>
          <div class="typing-dot" style="--delay: 0.4s"></div>
        </div>
      </div>
    </div>
  `;
  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight; // En son mesaja kaydır
  getChatResponse(incomingChatDiv);
};

// Giden mesajları işleme fonksiyonu
const handleOutGoingChat = () => {
  userText = chatInput.value.trim();
  if (!userText) {
    alert("Bir veri giriniz!");
    return;
  }

  const html = `
    <div class="chat-content">
      <div class="chat-details">
        <img src="./images/user.jpg" alt="user" />
        <p>${userText}</p>
      </div>
    </div>
  `;
  const outgoingChatDiv = createElement(html, "outgoing");
  if (document.querySelector(".default-text")) {
    document.querySelector(".default-text").remove();
  }
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight; // En son mesaja kaydır
  setTimeout(showTypingAnimation, 500);
  chatInput.value = ""; // Input alanını boşalt
};

// Gönder butonuna tıklama ve enter tuşuna basma olayları
sendButton.addEventListener("click", handleOutGoingChat);

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Enter tuşunun default davranışını engelle
    handleOutGoingChat();
  }
});

// Tema değiştirme butonu
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  themeButton.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
});

// Tüm sohbetleri silme butonu
deleteButton.addEventListener("click", () => {
  if (confirm("Tüm sohbetleri silmek istediğinizden emin misiniz?")) {
    chatContainer.innerHTML = "";
    localStorage.removeItem("chatHistory");
    const defaultText = `
      <div class="default-text">
        <h1>ChatGPT Clone</h1>
      </div>
    `;
    chatContainer.innerHTML = defaultText;
  }
});

// Sohbet geçmişini kaydetme
const saveChatHistory = () => {
  localStorage.setItem("chatHistory", chatContainer.innerHTML);
};

// Sohbet geçmişini yükleme
const loadChatContainer = () => {
  const chatHistory = localStorage.getItem("chatHistory");
  if (chatHistory) {
    chatContainer.innerHTML = chatHistory;
    if (document.querySelector(".default-text")) {
      document.querySelector(".default-text").remove();
    }
  }
};

document.addEventListener("DOMContentLoaded", loadChatContainer);
