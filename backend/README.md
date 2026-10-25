# Docker Management Dashboard - Backend API

A lightweight Node.js & TypeScript REST API that connects directly to the local Docker Engine socket (`dockerode`). This service exposes endpoints to manage Docker containers, images, volumes, and networks, serving as the backend for the Docker Management Web Interface.

---

## 🛠️ Tech Stack

* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Runtime:** [Node.js](https://nodejs.org/) (v18+)
* **Framework:** [Express.js](https://expressjs.com/)
* **Docker SDK:** [dockerode](https://github.com/apocas/dockerode)
* **Development Server:** [tsx](https://github.com/privatenumber/tsx) (Hot-reloading TypeScript execution)

---

## 🚀 Features

* **Docker Engine Connection:** Directly communicates with the local Docker daemon socket (`/var/run/docker.sock`).
* **Modular Architecture:** Clean separation of concerns using Controllers, Routes, and Config layers.
* **REST API Endpoints:** 
  * `GET /` — API Status & Health Check
  * `GET /api/containers` — Fetch all local Docker containers (both running and stopped)

---

## 📋 Prerequisites

Before running this project, ensure you have the following installed on your machine:

1. **[Node.js](https://nodejs.org/)** (v18 or higher) & `npm`
2. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Must be running in the background)

---

## 📦 Installation

1. **Clone or download the project repository:**
   ```bash
   git clone <your-repository-url>
   cd docker-backend
   npm i
   npm run dev