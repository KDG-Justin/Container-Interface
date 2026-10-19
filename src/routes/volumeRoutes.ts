import { Router } from "express";
import { getVolumes, removeVolume } from "../controllers/volumeController";


const volumeRouter = Router();


// Endpoints images
// GET /api/images
volumeRouter.get('/', getVolumes);

// DELETE /api/image/:name
volumeRouter.delete("/:name", removeVolume);


export default volumeRouter; 