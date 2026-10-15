import { Router } from "express";
import { getImages } from "../controllers/imageController";

const imageRouter = Router();


// Endpoints images
// GET /api/images
imageRouter.get('/', getImages);


export default imageRouter; 