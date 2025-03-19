# Chat UI

A modern, TypeScript-based chat interface built with React and Vite that provides a real-time communication experience through WebSockets.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- Real-time messaging through WebSocket connections
- Modern, responsive UI
- TypeScript for type safety
- Debug panel for development
- Customizable settings

## 🛠️ Tech Stack

- **Frontend Framework:** React
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** CSS
- **Real-time Communication:** WebSockets

## 📥 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/chat-ui.git
cd chat-ui
```

2. Install dependencies:

```bash
npm install
```

## 🚀 Usage

### Development Server

Start the development server:

```bash
npm run dev
```

This will start the development server at `http://localhost:5173` (or another port if 5173 is in use).

Note that if the agent server is running locally, you need to enable network access by running

```bash
npm run dev --host
```

### Build for Production

To build the application for production:

```bash
npm run build
```

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## 💻 Development

### Project Structure

```
src/
├── assets/         # Static assets
├── components/     # UI components
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
├── App.tsx         # Main application component
└── main.tsx        # Entry point
```

### TypeScript Configuration

The project uses TypeScript with strict mode enabled. Check the `tsconfig.json` file for detailed configuration.

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

### Development Guidelines

- Follow the TypeScript coding standards
- Write clear, commented code
- Add tests for new features
- Update documentation as needed

### Code Style

This project uses ESLint and Prettier for code formatting. Run linting with:

```bash
npm run lint
```

### Running Tests

Run tests with:

```bash
npm test
```

## 📄 License

This project is licensed under the terms of the license included in the repository.
