
Built by https://www.blackbox.ai

---

```markdown
# Oliver & Aang Roleplay Chat

## Project Overview

Oliver & Aang Roleplay Chat is a web-based application designed to facilitate roleplay conversations between two characters: Oliver and Aang. It features a chat interface, a memory system for retaining narrative scenes and folders, and an AI-powered response mechanism that mimics Aang's personality as a protective father. Users can engage in creative storytelling while managing various memories of their interactions.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
   
2. Navigate to the project directory:
   ```bash
   cd <project-directory>
   ```

3. Open the `index.html` file in your browser to run the application.

## Usage

1. Start the application by opening `index.html` in a web browser.
2. Type your messages in the input box designated for Oliver and press the send button.
3. Toggle the memory panel with the book icon button to manage and view memories.
4. Add new folders or scenes to enhance the roleplay experience.
5. Chat with Aang, who will respond based on both the context of the conversation and stored memories.

## Features

- **Chat Interface:** Easily send and receive messages between Oliver and Aang.
- **Memory System:** Create and organize memories into folders, allowing for rich storytelling.
- **AI Responses:** Aang's responses are generated via an AI, providing context-aware replies.
- **User-Friendly Design:** Built with Tailwind CSS for a responsive and aesthetically pleasing user experience.
- **LocalStorage Persistence:** Memories are saved in the browser's local storage, ensuring data is retained between sessions.

## Dependencies

This project leverages the following dependencies:

- **Tailwind CSS:** A utility-first CSS framework for styling.
- **Font Awesome:** For iconography.

The libraries are imported via CDN links in the `index.html` file:

```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
<script src="https://cdn.tailwindcss.com"></script>
```

## Project Structure

The project consists of the following files:

```
/Oliver-Aang-Roleplay-Chat
│
├── index.html  # Main HTML file containing the app layout
├── app.js      # JavaScript file managing app functionality and interactions
└── styles.css   # (Optional) Any additional styles can be added here if necessary
```

### File Descriptions

- **index.html:** Contains the structure of the web application, including the chat interface and memory panel.
- **app.js:** Implements the logic for chatting, managing memories, AI response generation, and user interactions.

## Contributing

If you'd like to contribute to the project, feel free to fork the repository and submit a pull request with your changes.

## License

This project is open-source and available under the MIT License.
```