import { Request, Response } from "express";
import docker from "../config/docker";
import { z } from "zod";

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


// GET /api/images/:id
export async function getImageDetails(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const parsedId = z.string().parse(id);
    const img = docker.getImage(parsedId);

    const inspectData = await img.inspect();
    const rawHistory = await img.history();
    const containers = await docker.listContainers({ all: true });

    const connectedContainers = containers
        .filter(
          (c: any) => c.ImageID === inspectData.Id || inspectData.RepoTags?.includes(c.Image),
        )
        .map((c: any) => ({
          id: c.Id,
          name: c.Names?.[0] ? c.Names[0].replace(/^\//, "") : "Unnamed",
        }));


    const history = rawHistory.map((layer: any) => ({
      id: layer.Id ? layer.Id.substring(0, 12) : 'unknown',
      createdBy: layer.CreatedBy || '',
      sizeFormatted: layer.Size > 1024 * 1024 
        ? `${(layer.Size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(layer.Size / 1024).toFixed(1)} KB`,
    }));

    return res.json({
      success: true,
      data: {
        id: inspectData.Id,
        shortId: inspectData.Id.replace('sha256:', '').substring(0, 12),
        tags: inspectData.RepoTags || ['<none>:<none>'],
        size: `${(inspectData.Size / (1024 * 1024)).toFixed(1)} MB`,
        created: new Date(inspectData.Created).toLocaleString(),
        containers: connectedContainers, 
        architecture: inspectData.Architecture, //vanaf hier model
        os: inspectData.Os,
        dockerVersion: inspectData.DockerVersion || 'Unknown',
        history: history,
      },
    });
  } catch (error: any) {
    console.error(`Error with getting details of container ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Could not get details of container',
    });
  }
}