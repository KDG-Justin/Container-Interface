import express from "express";
import cors from "cors";
import containerRouter from "./routes/containerRoutes";
import imageRouter from "./routes/imageRoutes"

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/containers", containerRouter);
app.use("/api/images", imageRouter); 
//for later de images, miss volumes en natuurlijk netwerken
// app.use('/api/volumes', volumeRoutes);
// app.use('/api/networks', networkRoutes);
app.listen(PORT, () => {
  console.log(`Server runs on http://localhost:${PORT}`);
});
