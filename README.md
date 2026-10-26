# Project Setup

An overview of requirements, installation steps, and troubleshooting tips for setting up this project.

## 📋 Requirements

Before running the project, make sure you have the following software installed.

### Windows

* **Node.js** 22 or higher (includes `npm`)

* **Windows Subsystem for Linux (WSL 2)**

* **Ubuntu** installed in WSL

* **Docker Engine** installed and running inside Ubuntu

> ⚠️ **Important:** Docker Engine must run inside the Ubuntu WSL environment. **Docker Desktop is not required** for this setup.

### Linux

* **Node.js** 22 or higher (includes `npm`)

* **Docker Engine** installed and running

* Access to the Docker socket at `/var/run/docker.sock`

## 🚀 Installation & Usage

### 1. Clone the Repository

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/KDG-Justin/Container-Interface.git
cd Container-Interface
```


### 2. Setup & Execution

#### 💻 Windows

Run the following commands from the project root directory:

1. **Installation:**

   ```bash
   npm run setup:wsl
   ```

   *This installs the frontend dependencies on Windows and the backend dependencies inside Ubuntu WSL.*

2. **Start the project:**

   ```bash
   npm run dev:wsl
   ```

   *The frontend runs on Windows, while the backend runs inside Ubuntu WSL and connects to the Docker Engine running in Ubuntu.*

#### 🐧 Linux

Run the following commands from the project root directory:

1. **Installation:**

   ```bash
   npm run setup
   ```

   *This installs both frontend and backend dependencies.*

2. **Start the project:**

   ```bash
   npm run dev
   ```

   *Both the frontend and backend run locally on Linux. The backend connects to the Docker Engine through `/var/run/docker.sock`.*

## 🐳 Docker Requirements

Make sure Docker Engine is running before starting the project.

You can verify that Docker is working by running:

```bash
docker ps
```

> **Tip:** If you receive a permission error on Linux, ensure your user has permission to access the Docker socket (e.g., `sudo usermod -aG docker $USER`).

## 🔍 Troubleshooting

| Issue | Solution |
| ----- | ----- |
| **Docker connection error** | Check that Docker Engine is running and that `/var/run/docker.sock` is accessible from the backend environment. |
| **WSL error on Windows** | Make sure WSL 2 and Ubuntu are installed correctly. |
| **Dependency installation error** | Check that Node.js 22 or higher and `npm` are installed. |
| **Containers or images are not displayed** | Verify that the backend is connected to the expected Docker Engine and that the frontend is using the correct backend API URL. |

## 📌 Notes

* Run all commands from the project root directory unless otherwise specified.
* **Windows:** Use `npm run setup:wsl` and `npm run dev:wsl`.
* **Linux:** Use `npm run setup` and `npm run dev`.
* Docker Engine **must** be running in UBUNTU where the backend expects to find it.
