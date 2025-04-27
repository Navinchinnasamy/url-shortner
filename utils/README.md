# URL Shortener

A scalable, modular Node.js application for shortening URLs, built with Express.js, MongoDB, and a custom Base62 encoding scheme. The application provides a JSON API for creating short URLs, redirecting to original URLs, and handling bulk operations, with an event-driven architecture for extensibility.

## 🚀 Features

- 🔗 Shorten long URLs to compact, shareable links
- 🧠 Uses Base62 encoding with 6-character unique short codes (up to 56.8 billion combinations)
- ⚡ Event-driven, non-blocking architecture for handling concurrent requests
- 📦 Modular design for reusability and easy scaling
- ☁️ Ready for future deployment via Docker, Kubernetes, or Azure
- 🌐 REST API with single and bulk shortening capabilities

## Project Overview

This URL shortener allows users to:
- Create short URLs via a JSON API (`POST /short`).
- Redirect from short URLs to original URLs (`GET /:slug`).
- Support bulk URL shortening for high-throughput use cases.
- Store URLs in MongoDB with a Mongoose schema.
- Use Base62 encoding for compact, readable short codes.
- Emit events for background tasks (e.g., analytics, logging).

The application is designed for scalability, with a modular structure separating concerns into configuration, controllers, models, services, utilities, and routes.

## Project Structure

```
url-shortener/
├── config/                   # Configuration files
│   └── db.js                 # MongoDB connection logic
├── controllers/              # Route controller logic
│   └── urlController.js      # Handles API requests (shorten, redirect, bulk)
├── models/                   # Database schemas
│   └── urlModel.js           # Mongoose model for storing URLs
├── services/                 # Business logic layer
│   └── urlService.js         # URL shortening, encoding, decoding logic
├── utils/                    # Utility modules
│   ├── base62.js             # Base62 encoding/decoding logic
│   └── eventEmitter.js       # Event-driven utility for background tasks
├── routes/                   # API route definitions
│   └── urlRoutes.js          # Express route bindings
├── .env                      # Environment variable configuration
├── server.js                 # Entry point of the application
├── package.json              # Project metadata and dependencies
└── README.md                 # Project documentation
```

### Directory and File Descriptions

- **`config/`**: Contains configuration files for the application.
  - `db.js`: Configures and establishes the MongoDB connection using Mongoose, handling connection pooling and error handling.

- **`controllers/`**: Houses controller logic for handling HTTP requests and responses.
  - `urlController.js`: Implements API endpoints for shortening URLs, redirecting to original URLs, and processing bulk URL shortening requests. Interacts with `urlService.js` for business logic.

- **`models/`**: Defines database schemas for persistent storage.
  - `urlModel.js`: Mongoose schema for URLs, including fields like `full` (original URL), `short` (short code), `clicks` (access count), and timestamps.

- **`services/`**: Encapsulates business logic, keeping controllers thin.
  - `urlService.js`: Handles URL shortening (generating short codes), encoding/decoding with Base62, and database operations. Ensures uniqueness of short codes and emits events for background tasks.

- **`utils/`**: Provides reusable utility modules.
  - `base62.js`: Implements Base62 encoding and decoding for generating compact, URL-safe short codes.
  - `eventEmitter.js`: Custom event emitter for asynchronous background tasks, such as logging clicks or triggering analytics.

- **`routes/`**: Defines Express.js route bindings.
  - `urlRoutes.js`: Maps API endpoints (e.g., `POST /short`, `GET /:slug`) to controller methods, applying middleware like rate limiting.

- **`.env`**: Stores environment variables, such as `MONGODB_URI`, `PORT`, and `NODE_ENV`, for configuration flexibility.

- **`server.js`**: The application’s entry point, initializing Express, middleware, routes, and the MongoDB connection.

- **`package.json`**: Contains project metadata, dependencies (e.g., `express`, `mongoose`, `dotenv`), and scripts for running and building the application.

- **`README.md`**: This file, documenting the project setup, structure, and usage.

## Setup Instructions

### Prerequisites
- Node.js 18+ (LTS recommended)
- MongoDB (local or cloud instance, e.g., MongoDB Atlas)
- npm (comes with Node.js)

### Installation
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd url-shortener
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root with the following:
   ```env
   MONGODB_URI=mongodb://localhost:27017/urlshort
   PORT=3000
   NODE_ENV=development
   ```

4. **Start MongoDB**:
   Ensure MongoDB is running locally (`mongod`) or accessible via `MONGODB_URI`.

5. **Run the Application**:
   - Development mode (with `nodemon` for auto-restart):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

6. **Access the API**:
   - The server runs at `http://localhost:3000` (or the configured `PORT`).
   - Test the API with tools like `curl` or Postman.

### Example API Requests
- **Create a Short URL**:
  ```bash
  curl -X POST http://localhost:3000/short \
  -H "Content-Type: application/json" \
  -d '{"fullUrl": "https://www.example.com"}'
  ```
  Response:
  ```json
  {
    "short": "aZqrXUbz",
    "full": "https://www.example.com",
    "clicks": 0,
    "createdAt": "2025-04-22T10:13:50.005Z"
  }
  ```

- **Redirect to Original URL**:
  ```bash
  curl -L http://localhost:3000/aZqrXUbz
  ```
  Redirects to: `https://www.example.com`

## Development

### Scripts
- `npm start`: Runs the application in production mode.
- `npm run dev`: Runs the application in development mode with `nodemon` for auto-reloading.
- `npm test`: (Add tests, e.g., using Jest, if implemented.)

### Adding Features
- **Analytics**: Extend `urlService.js` and `eventEmitter.js` to log click data or integrate with a third-party analytics service.
- **Bulk Shortening**: Enhance `urlController.js` to handle bulk URL requests in a single API call.
- **Authentication**: Add middleware in `urlRoutes.js` to secure endpoints with JWT or API keys.
- **UI**: Implement a frontend (e.g., React) or admin panel using a template engine like Pug or React SSR.

### Testing
- Use Postman or `curl` to test API endpoints.
- Implement unit tests for `urlService.js` and `base62.js` using Jest or Mocha.
- Test MongoDB connectivity with sample data:
  ```javascript
  use urlshort;
  db.urls.find();
  ```

## Deployment

### Docker
1. Create a `Dockerfile`:
   ```dockerfile
   FROM node:18
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. Create a `docker-compose.yml`:
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - MONGODB_URI=mongodb://mongo:27017/urlshort
       depends_on:
         - mongo
     mongo:
       image: mongo:latest
       volumes:
         - mongo-data:/data/db
   volumes:
     mongo-data:
   ```

3. Run:
   ```bash
   docker-compose up --build
   ```

### Kubernetes
- Deploy with a Kubernetes manifest for scalability (e.g., `Deployment` with replicas).
- Use a managed MongoDB service (e.g., MongoDB Atlas) for production.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License

MIT License. See `LICENSE` file for details.

## Contact

For issues or feature requests, open a GitHub issue or contact the maintainer at `navin@novactech.in`.