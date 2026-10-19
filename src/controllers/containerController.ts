import { Request, Response } from "express";
import docker from "../config/docker";
import { z } from "zod";

// GET /api/containers
export async function getContainers(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const containers = await docker.listContainers({ all: true });

    const formattedContainers = containers.map((container) => ({
      id: container.Id.substring(0, 12),
      name: container.Names?.[0]
        ? container.Names[0].replace(/^\//, "")
        : "Unnamed",
      image: container.Image,
      imageId: container.ImageID,
      state: container.State,
      status: container.Status,
      ports:
        container.Ports?.filter((p) => p.PublicPort)
          .map((p) => `${p.PublicPort}:${p.PrivatePort}`)
          .join(", ") || "-",
      created: container.Created,
    }));

    return res.json({
      data: formattedContainers,
    });
  } catch (error) {
    console.error("Error with getting containers:", error);

    const dockerError = error as {
      statusCode?: number;
      reason?: string;
      message?: string;
    };

    if (
      dockerError.statusCode === 404 ||
      dockerError.reason === "no such container"
    ) {
      return res.status(404).json({
        success: false,
        message: "Container not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Docker service is unavailable",
    });
  }
}

export async function getContainerDetails(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;
    const parsedId = z.string().parse(id);

    const container = docker.getContainer(parsedId);
    const data = await container.inspect();

    const formattedContainer = {
      id: data.Id || parsedId,
      name: data.Name ? data.Name.replace(/^\//, "") : "Unnamed",
      image: data.Config?.Image || "Unknown",
      state:
        data.State?.Status || (data.State?.Running ? "running" : "stopped"),
      status: data.State?.Status || "-",
      created: data.Created || "",
      ports: data.NetworkSettings?.Ports || {},
      portsDetail: data.NetworkSettings?.Ports || {},
      mounts: (data.Mounts || []).map((m) => ({
        type: m.Type || "volume",
        name: m.Name || "",
        source: m.Source || m.Name || "-",
        destination: m.Destination || "-",
        driver: m.Driver || "",
        rw: m.RW ?? true,
      })),
      networks: data.NetworkSettings?.Networks || {},
      env: data.Config?.Env || [],
    };

    return res.json({
      success: true,
      data: formattedContainer,
    });
  } catch (error) {
    console.error("Error with getting container details:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid container ID",
      });
    }

    const dockerError = error as {
      statusCode?: number;
      reason?: string;
      message?: string;
    };

    if (
      dockerError.statusCode === 404 ||
      dockerError.reason === "no such container"
    ) {
      return res.status(404).json({
        success: false,
        message: "Container not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Docker service is unavailable",
    });
  }
}

// POST /api/containers/:id/start
export async function startContainer(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;
    const parsedId = z.string().parse(id);
    const container = docker.getContainer(parsedId);
    await container.start();

    return res.json({
      success: true,
      message: `Container ${id} successfully started`,
    });
  } catch (error) {
    console.error("Error with starting the container:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid container ID",
      });
    }

    const dockerError = error as {
      statusCode?: number;
      reason?: string;
      message?: string;
    };

    if (
      dockerError.statusCode === 404 ||
      dockerError.reason === "no such container"
    ) {
      return res.status(404).json({
        success: false,
        message: "Container not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Docker service is unavailable",
    });
  }
}

// POST /api/containers/:id/stop
export async function stopContainer(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;
    const parsedId = z.string().parse(id);
    const container = docker.getContainer(parsedId);
    await container.stop();

    return res.json({
      success: true,
      message: `Container ${id} succesfully stopped`,
    });
  } catch (error) {
    console.error("Error with stopping the container:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid container ID",
      });
    }

    const dockerError = error as {
      statusCode?: number;
      reason?: string;
      message?: string;
    };

    if (
      dockerError.statusCode === 404 ||
      dockerError.reason === "no such container"
    ) {
      return res.status(404).json({
        success: false,
        message: "Container not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Docker service is unavailable",
    });
  }
}

// GET /api/containers/:id/logs
export async function getContainerLogs(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;
    const parsedId = z.string().parse(id);
    const container = docker.getContainer(parsedId);

    // alleen stdout en stderr + timestamps in de logs genomen
    const logsBuffer = await container.logs({
      stdout: true,
      stderr: true,
      timestamps: true,
      tail: 100,
    });

    // Dockerode geeft een Buffer terug
    const logs = logsBuffer.toString("utf-8");

    return res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error("Error with getting the container logs:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid container ID",
      });
    }

    const dockerError = error as {
      statusCode?: number;
      reason?: string;
      message?: string;
    };

    if (
      dockerError.statusCode === 404 ||
      dockerError.reason === "no such container"
    ) {
      return res.status(404).json({
        success: false,
        message: "Container not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Docker service is unavailable",
    });
  }
}

// DELETE /api/containers/:id
export async function removeContainer(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;
    const parsedId = z.string().parse(id);
    const container = docker.getContainer(parsedId);
    await container.remove();

    return res.json({
      success: true,
      message: `Container ${id} successfully removed`,
    });
  } catch (error) {
    console.error("Error with removing the container:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid container ID",
      });
    }

    const dockerError = error as {
      statusCode?: number;
      reason?: string;
      message?: string;
    };

    if (
      dockerError.statusCode === 404 ||
      dockerError.reason === "no such container"
    ) {
      return res.status(404).json({
        success: false,
        message: "Container not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Docker service is unavailable",
    });
  }
}
