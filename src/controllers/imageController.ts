import { Request, Response } from "express";
import docker from "../config/docker";

export async function getImages(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const images = await docker.listImages({ all: true });
    const containers = await docker.listContainers({ all: true });

    const imageMap = images.map((img: any) => {
      const connectedContainers = containers
        .filter(
          (c: any) => c.ImageID === img.Id || img.RepoTags?.includes(c.Image),
        )
        .map((c: any) => ({
          id: c.Id,
          name: c.Names?.[0] ? c.Names[0].replace(/^\//, "") : "Unnamed",
        }));

      // grootte in MB want size in bytes
      const sizeMB = (img.Size / (1024 * 1024)).toFixed(1);
      // tijd is in unix timestamp 1970 
      const createdDate = new Date(img.Created * 1000).toLocaleString();
      const tags = img.RepoTags && img.RepoTags.length > 0
          ? img.RepoTags
          : ["<none>:<none>"];

      return {
        id: img.Id,
        shortId: img.Id.replace("sha256:", "").substring(0, 12),
        tags: tags,
        size: `${sizeMB} MB`,
        created: createdDate,
        containers: connectedContainers,
      };
    });

    return res.json({
      success: true,
      data: imageMap,
    });
  } catch (error: any) {
    console.error("Error with getting images:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Could not get images",
    });
  }
}
