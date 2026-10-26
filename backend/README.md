# Docker Container Web Interface - Backend API

A lightweight Node.js & TypeScript REST API that connects directly to the local Docker Engine socket (`dockerode`). This service exposes endpoints to manage Docker containers, images, volumes, and networks, serving as the backend for the Docker Container Web Interface.

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
  * `GET /api/containers` — Fetch all local Docker containers (both running and stopped)
  * ...
  * `GET /api/images` — Fetch all local Docker images
  * ...
  * `GET /api/volumes` — Fetch all local Docker volumes
  * ...
  * `GET /api/networks` — Fetch all local Docker networks
  * ...

---