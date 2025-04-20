const welcomeScreen = document.getElementById('welcomeScreen');
const chatContainer = document.getElementById('chatContainer');
const btnNewChat = document.getElementById('btnNewChat');
const btnAllChats = document.getElementById('btnAllChats');
const btnBack = document.getElementById('btnBack');
const messagesDiv = document.getElementById('messages');
const typingIndicator = document.getElementById('typingIndicator');
const inputForm = document.getElementById('inputForm');
const inputMessage = document.getElementById('inputMessage');
const fileUpload = document.getElementById('fileUpload');
const downloadBtn = document.getElementById('downloadBtn');
const deleteBtn = document.getElementById('deleteBtn');

let chatHistory = [];

// Show welcome screen and hide chat container
function showWelcome() {
  welcomeScreen.style.display = 'block';
  chatContainer.style.display = 'none';
  clearChat();
  typingIndicator.textContent = '';
}

// Show chat container and hide welcome screen
function showChat() {
  welcomeScreen.style.display = 'none';
  chatContainer.style.display = 'flex';
  inputMessage.focus();
}

// Clear chat messages and history
function clearChat() {
  messagesDiv.innerHTML = '';
  chatHistory = [];
}

// Append message to chat area and save to history
function appendMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ' + (sender === 'Oliver' ? 'oliver' : 'aang');
  messageDiv.textContent = text;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  if (sender === 'Oliver') {
    chatHistory.push(`(Oliver) ${text}`);
  } else {
    chatHistory.push(`(To Remember) ${text}`);
  }
}

// Generate AI response using LM Studio API
async function generateAIResponse(userMessage) {
  const memoryContext = chatHistory.join('\n');
  const prompt = `You are Aang, a protective father to Oliver, a 5-year-old Fire Nation child. Use the following memories and the user's message to respond with personality, memory, and emotional depth.

Memories:
${memoryContext}

User message:
${userMessage}

Aang's response:`;

  const requestBody = {
    model: "Gemma-3-12b-it",
    messages: [
      { role: "system", content: "You are Aang, a protective father to Oliver." },
      { role: "user", content: prompt }
    ],
    max_tokens: 200,
    temperature: 0.7
  };

  try {
    typingIndicator.textContent = 'Aang is typing...';
    const response = await fetch("http://192.168.1.108:1235/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });
    typingIndicator.textContent = '';
    if (!response.ok) {
      alert('Error from AI service: ' + response.statusText);
      return "Sorry, I am having trouble responding right now.";
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";
  } catch (error) {
    typingIndicator.textContent = '';
    alert('Error contacting AI service.');
    return "Sorry, I am having trouble responding right now.";
  }
}

// Handle form submission
inputForm.addEventListener('submit', async e => {
  e.preventDefault();
  const userMessage = inputMessage.value.trim();
  if (!userMessage) return;
  appendMessage('Oliver', userMessage);
  inputMessage.value = '';
  const aiResponse = await generateAIResponse(userMessage);
  appendMessage('Aang', aiResponse);
});

// New Chat button
btnNewChat.addEventListener('click', () => {
  clearChat();
  showChat();
});

// All Chats button (placeholder)
btnAllChats.addEventListener('click', () => {
  alert('All Chats feature is not implemented yet.');
});

// Back to Welcome button
btnBack.addEventListener('click', () => {
  showWelcome();
});

// Download chat button
downloadBtn.addEventListener('click', () => {
  if (chatHistory.length === 0) {
    alert('No chat history to download.');
    return;
  }
  const blob = new Blob([chatHistory.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'oliver_aang_chat.txt';
  a.click();
  URL.revokeObjectURL(url);
});

// Delete memory button
deleteBtn.addEventListener('click', () => {
  if (chatHistory.length === 0) {
    alert('No memory to delete.');
    return;
  }
  if (confirm('Are you sure you want to delete the memory? This will clear the chat history.')) {
    clearChat();
  }
});

// File upload for memory file
fileUpload.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(event) {
    const text = event.target.result;
    loadChatFromText(text);
  };
  reader.readAsText(file);
});

// Load chat history from uploaded text file
function loadChatFromText(text) {
  clearChat();
  const lines = text.split('\n').filter(line => line.trim() !== '');
  lines.forEach(line => {
    if (line.startsWith('(Oliver) ')) {
      appendMessage('Oliver', line.replace('(Oliver) ', ''));
    } else if (line.startsWith('(To Remember) ')) {
      appendMessage('Aang', line.replace('(To Remember) ', ''));
    }
  });
  showChat();
}

// Initialize app
showWelcome();
</create_file>
