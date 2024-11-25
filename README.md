# UpDown App

This is a full-stack application that allows users to place bets and view leaderboards. The project is divided into two main parts: the server and the client.

## Prerequisites

- Node.js (version 20.18.0 or later)
- Docker
- Docker Compose
- ngrok (for local testing)

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/peppesilletti/updown-app.git
cd updown-app
```

### 2. Environment Variables

#### Server

Create a `.env` file in the `server` directory by copying the `.env.example` file:

```bash
cp server/.env.example server/.env
```

Fill in the necessary environment variables in the `server/.env` file.

Also, create a `gcp-service-account.json` file in the `server` root directory and add your Google Cloud service account key.

#### Client

Create a `.env` file in the `client` directory by copying the `.env.example` file:

```bash
cp client/.env.example client/.env
```

### 3. Install Dependencies

#### Server

Navigate to the `server` directory and install the dependencies:

```bash
cd server
npm install
```

#### Client

Navigate to the `client` directory and install the dependencies:

```bash
cd client
npm install
```

### 4. Database Setup

Ensure Docker is running, then start the PostgreSQL database using Docker Compose:

```bash
cd server
```

```bash
npm run db:up
```

Run the database migrations:

```bash
npm run db:migrate
```

If you need to generate the database types, run:

```bash
npm run db:generate-types
```

### 5. Running the Application

#### Server

Run ngrok to create a local tunnel to the server:

```bash
ngrok http http://127.0.0.1:3000
```

Then copy the ngrok URL and add it to the `server/.env` file as `BETS_CHECK_URL`.

To start the server, run the following command in the `server` directory:

```bash
npm run dev
```

#### Client

To start the client, run the following command in the `client` directory:

```bash
npm run dev
```

### 6. Access the Application

- The server will be running on `http://localhost:3000`.
- The client will be running on `http://localhost:5173`.

## Testing

To run the tests, use the following commands in the `server` directory:

```bash
cd server
```

Then copy the the .env.test.example file to a .env.test file:

```bash
cp .env.test.example .env.test
```

```bash
npm run db-test:up
npm run test:dev
```

## Deployment

- A new version of the app is deployed to Google Cloud Run every time a new commit is pushed to the `main` branch.
- A new version of the client is deployed to Cloudflare Pages every time a new commit is pushed to the `main` branch.

## Additional Information

- The server uses Fastify and PostgreSQL.
- The client is built with React and Vite.
- Environment variables are managed using `dotenv-flow`.
