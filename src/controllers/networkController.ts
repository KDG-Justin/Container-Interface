import { Request, Response } from "express";
import docker from "../config/docker";
import { z } from "zod";


// GET /api/networks
export async function getNetworks(req: Request, res: Response): Promise<Response> {
  try {
    const networks = await docker.listNetworks();
    const containers = await docker.listContainers({ all: true });

    const mappedNetworks = networks.map((net: any) => {
      const connectedContainers = containers
        .filter((c: any) => {
          const containerNetworks = c.NetworkSettings?.Networks || {};
          return Object.keys(containerNetworks).some(
            (netKey) => netKey === net.Name || containerNetworks[netKey]?.NetworkID === net.Id
          );
        })
        .map((c: any) => ({
          id: c.Id.substring(0, 12),
          name: c.Names?.[0] ? c.Names[0].replace(/^\//, '') : 'Unnamed',
        }));

      // Subnet
      const ipamConfig = net.IPAM?.Config?.[0] || {};

      return {
        id: net.Id,
        shortId: net.Id.substring(0, 12),
        name: net.Name,
        driver: net.Driver || 'unknown',
        scope: net.Scope || 'local',
        subnet: ipamConfig.Subnet || '-',
        gateway: ipamConfig.Gateway || '-',
        // standaard networks
        isSystem: ['bridge', 'host', 'none'].includes(net.Name),
        containers: connectedContainers,
      };
    });

    return res.json({
      success: true,
      data: mappedNetworks,
    });
  } catch (error) {
    console.error("Error with getting networks:", error);

    const dockerError = error as {
      statusCode?: number;
      reason?: string;
      message?: string;
    };

    if (
      dockerError.statusCode === 404 ||
      dockerError.reason === "No such network"
    ) {
      return res.status(404).json({
        success: false,
        message: "Network not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Docker service is unavailable",
    });
  }
}

// DELETE /api/networks/:id
export async function removeNetwork(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const parsedId = z.string().parse(id);
    const network = docker.getNetwork(parsedId);
    await network.remove();

    return res.json({
      success: true,
      message: 'Network removed',
    });
  } catch (error) {
    console.error("Error with getting networks:", error);

    const dockerError = error as {
      statusCode?: number;
      reason?: string;
      message?: string;
    };

    if (
      dockerError.statusCode === 404 ||
      dockerError.reason === "no such network"
    ) {
      return res.status(404).json({
        success: false,
        message: "Network not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Docker service is unavailable",
    });
  }
}