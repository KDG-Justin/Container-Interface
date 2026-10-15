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

    return res.json({
      success: true,
      count: containers.length,
      data: containers,
    });
  } catch (error) {
    console.error("Error with getting containers:", error);

    return res.status(500).json({
      success: false,
      message: "Docker desktop is offline",
    });
  }
}

// GET /api/containers/id
export async function getContainerDetails(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;
    const parsedId = z.string().parse(id);
    const container = docker.getContainer(parsedId);
    const data = await container.inspect();

    return res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error with getting the container:", error);

    return res.status(500).json({
      success: false,
      message: "Docker desktop is offline",
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
  } catch (error: any) {
    console.error(`Error with starting container ${req.params.id}:`, error);

    return res.status(500).json({
      success: false,
      message: error.reason || error.message || "Could not start container",
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
  } catch (error: any) {
    console.error(`Error with stopping container ${req.params.id}:`, error);

    return res.status(500).json({
      success: false,
      message: error.reason || error.message || "Could not stop container",
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
      tail: 100, // laatste 100 regels
    });

    // Dockerode geeft een Buffer terug
    const logs = logsBuffer.toString("utf-8");

    return res.json({
      success: true,
      data: logs,
    });
  } catch (error: any) {
    console.error(
      `Error with getting logs from container ${req.params.id}:`,
      error,
    );
    return res.status(500).json({
      success: false,
      message: error.message || "Could not get container logs.",
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
  } catch (error: any) {
    console.error(`Error with removing container ${req.params.id}:`, error);

    return res.status(500).json({
      success: false,
      message: error.reason || error.message || "Could not remove container",
    });
  }
}
