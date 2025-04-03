document.addEventListener("DOMContentLoaded", () => {
  const chatbotBtn = document.createElement("button");
  chatbotBtn.id = "chatbot-button";
  chatbotBtn.innerHTML = "💬";

  const chatbotWindow = document.createElement("div");
  chatbotWindow.id = "chatbot-window";
  chatbotWindow.innerHTML = `
    <div id="chatbot-header">
      <span>🤖 LogiBot</span>
      <button id="chatbot-close">❌</button>
    </div>
    <div id="chatbot-messages">
      <div class="message bot-message">👋 ¡Hola! Soy LogiBot. Pregúntame lo que necesites sobre los eventos.</div>
      <div class="suggested-questions">
        <button class="suggested-btn">¿Cómo puedo reservar una entrada?</button>
        <button class="suggested-btn">¿Qué métodos de pago aceptan?</button>
        <button class="suggested-btn">¿Dónde se realizan los eventos?</button>
      </div>
    </div>
    <div id="chatbot-input">
      <input type="text" id="chatbot-user-input" placeholder="Escribe tu pregunta...">
      <button id="chatbot-send">➤</button>
    </div>
  `;

  document.body.appendChild(chatbotBtn);
  document.body.appendChild(chatbotWindow);

  const messagesContainer = document.getElementById("chatbot-messages");
  const userInput = document.getElementById("chatbot-user-input");

  chatbotBtn.addEventListener("click", () => {
    chatbotWindow.classList.add("active");
  });

  document.getElementById("chatbot-close").addEventListener("click", () => {
    chatbotWindow.classList.remove("active");
  });

  document.getElementById("chatbot-send").addEventListener("click", enviarPregunta);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") enviarPregunta();
  });

  const suggestedButtons = document.querySelectorAll(".suggested-btn");
  suggestedButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      userInput.value = btn.textContent;
      enviarPregunta();
    });
  });

  async function enviarPregunta() {
    const pregunta = userInput.value.trim();
    console.log("Pregunta:", pregunta);
    if (!pregunta) console.log("❌ No se ha ingresado una pregunta.");

    messagesContainer.innerHTML += `<div class="message user-message">${pregunta}</div>`;
    userInput.value = "";

    try {
      const tokenResponse = await fetch("https://requeproyectoweb-production-2f69.up.railway.app/token");
      const tokenData = await tokenResponse.json();
      const token = tokenData.token;

      const dfResponse = await fetch(
        "https://dialogflow.googleapis.com/v2/projects/newagent-wemi/agent/sessions/123456:detectIntent",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            queryInput: {
              text: {
                text: pregunta,
                languageCode: "es",
              },
            },
          }),
        }
      );

      const data = await dfResponse.json();
      const reply = data.queryResult.fulfillmentText || "🤖 No entendí tu pregunta.";

      messagesContainer.innerHTML += `<div class="message bot-message">${reply}</div>`;
    } catch (error) {
      console.error("❌ Error:", error);
      messagesContainer.innerHTML += `<div class="message bot-message">❌ Error al conectar con el chatbot.</div>`;
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});
