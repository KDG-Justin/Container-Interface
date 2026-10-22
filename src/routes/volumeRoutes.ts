import { Router } from "express";
import { getVolumeDetails, getVolumes, removeVolume } from "../controllers/volumeController";


const volumeRouter = Router();


// Endpoints volumes
// GET /api/images
volumeRouter.get('/', getVolumes);

// DELETE /api/volumes/:name
volumeRouter.delete("/:name", removeVolume);

// GET /api/volumes/:name
volumeRouter.get('/:name', getVolumeDetails)


export default volumeRouter; 