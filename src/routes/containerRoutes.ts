import { Router } from "express";
import {
  getContainerDetails,
  getContainerLogs,
  getContainers,
  removeContainer,
  startContainer,
  stopContainer,
} from "../controllers/containerController";

const containerRouter = Router();

// Endpoints container
// GET /api/containers
containerRouter.get("/", getContainers);

// GET /api/containers/id
containerRouter.get("/:id", getContainerDetails);

// POST /api/containers/:id/start
containerRouter.post("/:id/start", startContainer);

// POST /api/containers/:id/stop
containerRouter.post("/:id/stop", stopContainer);

// GET /apu/containers/:id/logs
containerRouter.get("/:id/logs", getContainerLogs);

// DELETE /api/containers/:id
containerRouter.delete("/:id", removeContainer);

export default containerRouter;
