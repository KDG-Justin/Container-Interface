import { Router } from "express";
import { getImageDetails, getImages } from "../controllers/imageController";

const imageRouter = Router();


// Endpoints images
// GET /api/images
imageRouter.get('/', getImages);

// GET /api/image/:id
imageRouter.get('/:id', getImageDetails); 


export default imageRouter; 