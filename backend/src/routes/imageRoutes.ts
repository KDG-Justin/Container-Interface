import { Router } from "express";
import { getImageDetails, getImages, removeImage } from "../controllers/imageController";

const imageRouter = Router();


// Endpoints images
// GET /api/images
imageRouter.get('/', getImages);

// GET /api/images/:id
imageRouter.get('/:id', getImageDetails); 

// DELETE /api/images/:id
imageRouter.delete("/:id", removeImage);


export default imageRouter; 