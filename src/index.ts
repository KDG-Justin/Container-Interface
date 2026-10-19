import express from "express";
import cors from "cors";
import containerRouter from "./routes/containerRoutes";
import imageRouter from "./routes/imageRoutes";
import volumeRouter from "./routes/volumeRoutes";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/containers", containerRouter);
app.use("/api/images", imageRouter);
app.use("/api/volumes", volumeRouter); 
// app.use('/api/networks', networkRoutes);

app.listen(PORT, () => {
  console.log(`Server runs on http://localhost:${PORT}`);
});
