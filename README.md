# Chat UI

A modern, TypeScript-based chat interface built with React and Vite that provides a real-time communication experience through WebSockets.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Docker Deployment](#docker-deployment)
- [Azure Container Apps Deployment](#azure-container-apps-deployment)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- Real-time messaging through WebSocket connections
- Modern, responsive UI
- TypeScript for type safety
- Debug panel for development
- Customizable settings

## 🔌 WebSocket Connection

This application connects directly to WebSocket servers for real-time communication. Key points:

- WebSocket connections are made directly from the browser to the backend server
- By default connects to `ws://localhost:501` but this can be configured
- Supports both `ws://` and secure `wss://` protocols
- Connection endpoints include `/chat` and `/system`
- No proxy is required for WebSocket connections

### WebSocket Configuration

The WebSocket URI can be configured in multiple ways:
- During development: Edit `src/config.ts` defaults
- At build time: Set environment variables during Docker build
- At runtime: Set the `WS_URI` environment variable when running the container

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

## 🐳 Docker Deployment

You can easily deploy this application using Docker. The project includes a complete Docker setup with Nginx for serving the frontend and proxying WebSocket connections.

Refer to [DOCKER.md](DOCKER.md) for detailed instructions on using Docker for deployment.

### Quick Start with Docker

> **Note**: We've simplified our Docker deployment approach! We now use direct Docker commands instead of Docker Compose for easier setup and maintenance. See [DOCKER_MIGRATION.md](DOCKER_MIGRATION.md) for details.

1. Use the provided script (recommended):

```bash
./docker-run.sh
```

2. Or build and run manually:

```bash
docker build -t chat-ui:latest .
docker run -d --name chat-ui -p 8080:80 -e WS_URI=ws://your-backend-server chat-ui:latest
```

3. Access the application at `http://localhost:8080`

### Environment Variables

Configure the application using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| WS_URI | WebSocket server URI | ws://localhost:501 |

For detailed Docker deployment instructions, see [DOCKER.md](DOCKER.md).

## ☁️ Azure Container Apps Deployment

This application can be deployed to Azure Container Apps using the provided Makefile and deployment scripts.

### Quick Start with Azure

There are two ways to configure your deployment:

#### Option 1: Using a .env file (recommended)

1. Initialize a new .env file from the template:
   ```bash
   make init
   ```

2. Edit the .env file with your specific values:
   ```bash
   # Azure Container Registry configuration
   ACR_NAME=youracr
   RESOURCE_GROUP=yourresourcegroup
   CONTAINER_APP_ENV=yourcontainerenv
   
   # Application configuration
   CONTAINER_APP_NAME=chat-ui
   IMAGE_NAME=chat-ui
   IMAGE_TAG=latest
   
   # Application settings
   WS_URI=wss://your-backend-service.com/websocket
   
   # Optional: Azure region
   LOCATION=eastus
   ```

#### Option 2: Using environment variables or editing the Makefile

1. Edit the Makefile directly or set environment variables when running commands:
   - `ACR_NAME`: Your Azure Container Registry name
   - `RESOURCE_GROUP`: Your Azure Resource Group
   - `CONTAINER_APP_ENV`: Your Container App Environment name
   - `WS_URI`: Your WebSocket backend URI
   - `LOCATION`: Azure region for deployment

### Building and Deploying

1. Build and push the AMD64 image (suitable for Azure from ARM-based Macs):
   ```bash
   make image push
   ```

2. Deploy to Azure Container Apps:
   ```bash
   make deploy
   ```

3. Or do all steps at once:
   ```bash
   make all-steps
   ```

### Testing Locally Before Deployment

You can test your container locally with Azure-like environment variables:

```bash
./test-azure-container.sh
```

### CI/CD with GitHub Actions

The repository includes a GitHub Actions workflow for automated deployment to Azure Container Apps. Configure the required secrets in your GitHub repository:

- `AZURE_CREDENTIALS`: Azure service principal credentials
- `ACR_NAME`: Your Azure Container Registry name
- `ACR_USERNAME` and `ACR_PASSWORD`: ACR credentials
- `RESOURCE_GROUP`: Your Azure Resource Group
- `CONTAINER_APP_ENV`: Your Container App Environment name
- `WS_URI`: Your WebSocket backend URI

For detailed Azure deployment instructions, see [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md). 

For information about how the `.env` file system is implemented, see [ENV_FILE_INTEGRATION.md](ENV_FILE_INTEGRATION.md).

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
