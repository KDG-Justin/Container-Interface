import { Router } from "express";
import { getImageDetails, getImages, removeImage } from "../controllers/imageController";

const imageRouter = Router();


// Endpoints images
// GET /api/images
imageRouter.get('/', getImages);

// GET /api/image/:id
imageRouter.get('/:id', getImageDetails); 

// DELETE /api/image/:id
imageRouter.delete("/:id", removeImage);


export default imageRouter; 