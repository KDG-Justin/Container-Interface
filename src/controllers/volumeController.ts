import { Request, Response } from "express";
import docker from "../config/docker";
import { z } from "zod";


// GET /api/volumes
export async function getVolumes(req: Request, res: Response): Promise<Response> {
  try {
    const volumeData = await docker.listVolumes();
    const containers = await docker.listContainers({ all: true });

    const rawVolumes = volumeData.Volumes || [];

    const mappedVolumes = rawVolumes.map((vol: any) => {
      const connectedContainers = containers
        .filter((c: any) => 
          c.Mounts && c.Mounts.some((m: any) => m.Name === vol.Name || m.Source === vol.Mountpoint)
        )
        .map((c: any) => ({
          id: c.Id,
          name: c.Names?.[0] ? c.Names[0].replace(/^\//, "") : "Unnamed",
        }));

      return {
        name: vol.Name,
        type: vol.type || 'volume', 
        source: vol.Source || vol.Name || "-",
        rw: vol.RW,
        driver: vol.Driver || 'local',
        mountpoint: vol.Mountpoint,
        created: vol.CreatedAt ? new Date(vol.CreatedAt).toLocaleString() : 'Unknown',
        containers: connectedContainers,
      };
    });

    return res.json({
      success: true,
      data: mappedVolumes,
    });
  } catch (error) {
    console.error("Error with getting volumes:", error);

    const dockerError = error as {
      statusCode?: number;
      reason?: string;
      message?: string;
    };

    if (
      dockerError.statusCode === 404 ||
      dockerError.reason === "no such volume"
    ) {
      return res.status(404).json({
        success: false,
        message: "Volume not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Docker service is unavailable",
    });
  }
}

// DELETE /api/volumes/:name
export async function removeVolume(req: Request, res: Response): Promise<Response> {
  try {
    const { name } = req.params;
    const parsedName = z.string().parse(name);
    const volume = docker.getVolume(parsedName);
    await volume.remove();

    return res.json({
      success: true,
      message: `Volume ${name} removed`,
    });
  } catch (error) {
    console.error("Error with removing the volume:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid volume name",
      });
    }

    const dockerError = error as {
      statusCode?: number;
      reason?: string;
      message?: string;
    };

    if (
      dockerError.statusCode === 404 ||
      dockerError.reason === "no such volume"
    ) {
      return res.status(404).json({
        success: false,
        message: "Volume not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Docker service is unavailable",
    });
  }
}