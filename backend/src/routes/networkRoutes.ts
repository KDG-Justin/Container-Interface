import { Router } from "express";
import { getNetworks, removeNetwork } from "../controllers/networkController";


const networkRouter = Router();


// Endpoints volumes
// GET /api/networks
networkRouter.get('/', getNetworks);

// DELETE /api/networks/:id
networkRouter.delete("/:name", removeNetwork);

export default networkRouter; 