# Docker Management Dashboard - Frontend

A modern, responsive, and user-friendly web interface built with React, TypeScript, and Tailwind CSS. This application allows users to monitor and manage local Docker resources (Containers, Images, Volumes, and Networks) through a clean dashboard, addressing common CLI pain points like dependency conflicts during resource cleanup.

---

## 🛠️ Tech Stack

* **Framework:** [React 18+](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Routing:** [React Router v6](https://reactrouter.com/)
* **Data Fetching & State Management:** [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
* **HTTP Client:** [Axios](https://axios-http.com/)
* **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Key Features

* **Container Management:** View running and stopped containers, inspect details, stream live logs, and execute start/stop/remove actions.
* **Image Management:** List images, inspect tags and sizes, and safely clean up unused/dangling images.
* **Volume & Network Control:** Visual Overview of attached volumes and networks.
* **Dependency Protection:** Visual warnings and smart deletion routines to prevent errors when removing images, volumes, or networks that are still bound to active containers.
* **Real-time Updates:** Automatic polling and cache invalidation via React Query for near real-time status monitoring.

---

## 📋 Prerequisites

Ensure you have the following set up before starting the frontend:

1. **[Node.js](https://nodejs.org/)** (v18 or higher) & `npm`
2. **Docker Dashboard Backend:** The Express/TypeScript API service must be running locally on `http://localhost:3000`.

---

## 📦 Setup

1. **Navigate to the frontend project directory:**
   ```bash
   cd docker-frontend
   npm install
   npm run dev