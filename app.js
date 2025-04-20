/**
 * Oliver & Aang Roleplay Chat App
 * Placeholder AI logic and memory system with localStorage persistence.
 */

const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const memoryToggleBtn = document.getElementById('memoryToggleBtn');
const memoryPanel = document.getElementById('memoryPanel');
const foldersList = document.getElementById('foldersList');
const addFolderBtn = document.getElementById('addFolderBtn');
const sceneModal = document.getElementById('sceneModal');
const sceneForm = document.getElementById('sceneForm');
const sceneTitleInput = document.getElementById('sceneTitle');
const sceneTextInput = document.getElementById('sceneText');
const cancelSceneBtn = document.getElementById('cancelSceneBtn');
const closeSceneModalBtn = document.getElementById('closeSceneModalBtn');

let memories = {};
let currentFolderId = null;
let editingScene = null;

// Default folders with example names
const defaultFolders = [
  "Sweet daily moments between Aang and Oliver",
  "Big emotional fights",
  "Soft and intimate make-ups",
  "Scenes where Aang dresses Oliver in Air Nomad clothes",
  "Scenes where Oliver acts like a baby when hurt",
  "Funny and silly Oliver moments",
  "Oliver sees Aang as his real dad"
];

// Utility: generate unique IDs
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Load memories from localStorage or initialize defaults
function loadMemories() {
  const stored = localStorage.getItem('memories');
  if (stored) {
    memories = JSON.parse(stored);
  } else {
    // Initialize folders with empty scenes array
    memories = {};
    defaultFolders.forEach(folderName => {
      const id = generateId();
      memories[id] = {
        id,
        name: folderName,
        scenes: []
      };
    });
    saveMemories();
  }
}

// Save memories to localStorage
function saveMemories() {
  localStorage.setItem('memories', JSON.stringify(memories));
}

// Render folders list in memory panel
function renderFolders() {
  foldersList.innerHTML = '';
  Object.values(memories).forEach(folder => {
    const folderDiv = document.createElement('div');
    folderDiv.className = 'border border-gray-300 rounded p-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center';
    folderDiv.tabIndex = 0;
    folderDiv.setAttribute('role', 'button');
    folderDiv.textContent = folder.name;
    folderDiv.onclick = () => {
      openFolderScenes(folder);
    };
    foldersList.appendChild(folderDiv);
  });
  // Render scenes of the first folder by default
  const firstFolder = Object.values(memories)[0];
  if (firstFolder) {
    openFolderScenes(firstFolder);
  }
}

// Open folder scenes in a separate panel below folders
function openFolderScenes(folder) {
  // Remove existing scenes list if any
  const existingScenesList = document.getElementById('scenesList');
  if (existingScenesList) {
    existingScenesList.remove();
  }

  const scenesList = document.createElement('div');
  scenesList.id = 'scenesList';
  scenesList.className = 'mt-4 space-y-3 max-h-96 overflow-y-auto border-t border-gray-300 pt-2';

  folder.scenes.forEach(scene => {
    const sceneDiv = document.createElement('div');
    sceneDiv.className = 'border border-gray-300 rounded p-2 cursor-pointer hover:bg-gray-50 flex justify-between items-center';
    sceneDiv.tabIndex = 0;
    sceneDiv.setAttribute('role', 'button');
    sceneDiv.textContent = scene.title;
    sceneDiv.onclick = () => {
      openSceneModal(scene);
    };
    scenesList.appendChild(sceneDiv);
  });

  // Add button to add new scene
  const addSceneBtn = document.createElement('button');
  addSceneBtn.className = 'mt-2 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500';
  addSceneBtn.textContent = '+ Add Scene';
  addSceneBtn.onclick = () => {
    openSceneModal(null, folder.id);
  };
  scenesList.appendChild(addSceneBtn);

  foldersList.appendChild(scenesList);
}

// Open scene modal for adding/editing
function openSceneModal(scene = null) {
  editingScene = scene;
  if (scene) {
    sceneTitleInput.value = scene.title;
    sceneTextInput.value = scene.text;
  } else {
    sceneTitleInput.value = '';
    sceneTextInput.value = '';
  }
  sceneModal.classList.remove('hidden');
  sceneTitleInput.focus();
}

// Close scene modal
function closeSceneModal() {
  editingScene = null;
  sceneModal.classList.add('hidden');
  sceneForm.reset();
}

// Add or update scene in current folder
function saveScene(event) {
  event.preventDefault();
  if (!currentFolderId) return alert('Please select a memory folder first.');

  const title = sceneTitleInput.value.trim();
  const text = sceneTextInput.value.trim();
  if (!title || !text) return alert('Title and Scene Text are required.');

  const folder = memories[currentFolderId];
  if (editingScene) {
    // Update existing scene
    const sceneIndex = folder.scenes.findIndex(s => s.id === editingScene.id);
    if (sceneIndex !== -1) {
      folder.scenes[sceneIndex].title = title;
      folder.scenes[sceneIndex].text = text;
    }
  } else {
    // Add new scene
    folder.scenes.push({
      id: generateId(),
      title,
      text
    });
  }
  saveMemories();
  renderScenes();
  closeSceneModal();
}

// Add new folder
function addFolder() {
  const folderName = prompt('Enter new memory folder name:');
  if (!folderName) return;
  const id = generateId();
  memories[id] = {
    id,
    name: folderName,
    scenes: []
  };
  saveMemories();
  renderFolders();
}

// Modified openSceneModal to accept folderId for adding new scene
function openSceneModal(scene = null, folderId = null) {
  editingScene = scene;
  editingFolderId = folderId;
  if (scene) {
    sceneTitleInput.value = scene.title;
    sceneTextInput.value = scene.text;
  } else {
    sceneTitleInput.value = '';
    sceneTextInput.value = '';
  }
  sceneModal.classList.remove('hidden');
  sceneTitleInput.focus();
}

// Modified saveScene to save new scene to specified folder
function saveScene(event) {
  event.preventDefault();
  const title = sceneTitleInput.value.trim();
  const text = sceneTextInput.value.trim();
  if (!title || !text) return alert('Title and Scene Text are required.');

  if (editingScene) {
    // Update existing scene
    const folder = Object.values(memories).find(f => f.scenes.some(s => s.id === editingScene.id));
    if (folder) {
      const sceneIndex = folder.scenes.findIndex(s => s.id === editingScene.id);
      if (sceneIndex !== -1) {
        folder.scenes[sceneIndex].title = title;
        folder.scenes[sceneIndex].text = text;
      }
    }
  } else {
    // Add new scene
    const folder = editingFolderId ? memories[editingFolderId] : Object.values(memories)[0];
    if (!folder) return alert('No memory folder available to add scene.');
    folder.scenes.push({
      id: generateId(),
      title,
      text
    });
  }
  saveMemories();
  renderFolders();
  closeSceneModal();
}

// Append chat message to chat area
function appendChatMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = sender === 'Oliver' ? 'text-right' : 'text-left';
  const bubble = document.createElement('div');
  bubble.className =
    sender === 'Oliver'
      ? 'inline-block bg-blue-600 text-white px-4 py-2 rounded-lg max-w-xs break-words'
      : 'inline-block bg-gray-300 text-gray-900 px-4 py-2 rounded-lg max-w-xs break-words';
  bubble.textContent = text;
  messageDiv.appendChild(bubble);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Placeholder AI response logic (Aang as protective father)
// Updated to integrate with LM Studio API
async function generateAIResponse(userMessage) {
  // Prepare full memory context by concatenating all scenes' texts
  const allScenes = [];
  Object.values(memories).forEach(folder => {
    folder.scenes.forEach(scene => {
      allScenes.push(scene.text);
    });
  });
  const memoryContext = allScenes.join("\n---\n");

  // Optionally, include recent chat history (last 5 messages)
  // For simplicity, this example does not implement chat history tracking yet

  // Construct prompt for LM Studio
  const prompt = `You are Aang, a protective father to Oliver, a 5-year-old Fire Nation child. Use the following memories and the user's message to respond with personality, memory, and emotional depth.

Memories:
${memoryContext}

User message:
${userMessage}

Aang's response:`;

  // Prepare API request body according to LM Studio chat completions API
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
    console.log("Sending request to LM Studio API:", requestBody);
    const response = await fetch("http://192.168.1.108:1235/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      console.error("LM Studio API error:", response.statusText);
      return "Sorry, I am having trouble responding right now.";
    }
    const data = await response.json();
    console.log("LM Studio API response:", data);
    // Assuming the response structure contains choices[0].message.content
    return data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Fetch error:", error);
    return "Sorry, I am having trouble responding right now.";
  }
}

// Update memory with new scene based on message
function updateMemoryWithMessage(message) {
  // Add new scene to "Sweet daily moments between Aang and Oliver" folder
  const folder = Object.values(memories).find(f => f.name === "Sweet daily moments between Aang and Oliver");
  if (!folder) return;
  const newScene = {
    id: generateId(),
    title: `Chat snippet at ${new Date().toLocaleTimeString()}`,
    text: message
  };
  folder.scenes.push(newScene);
  saveMemories();
  // No need to re-render scenes here as memory panel is independent of chat
}

// Event listeners
chatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;
  appendChatMessage('Oliver', userMessage);
  chatInput.value = '';
  // Generate AI response asynchronously
  const aiResponse = await generateAIResponse(userMessage);
  appendChatMessage('Aang', aiResponse);
  // Update memory
  updateMemoryWithMessage(userMessage);
});

memoryToggleBtn.addEventListener('click', () => {
  if (memoryPanel.classList.contains('hidden')) {
    memoryPanel.classList.remove('hidden');
  } else {
    memoryPanel.classList.add('hidden');
  }
});

addFolderBtn.addEventListener('click', addFolder);
sceneForm.addEventListener('submit', saveScene);
cancelSceneBtn.addEventListener('click', closeSceneModal);
closeSceneModalBtn.addEventListener('click', closeSceneModal);

// Keyboard accessibility for modal close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !sceneModal.classList.contains('hidden')) {
    closeSceneModal();
  }
});

let editingFolderId = null;

// Initialize app
function init() {
  loadMemories();
  renderFolders();
}

init();
