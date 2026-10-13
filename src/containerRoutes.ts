import { Router } from 'express';
import { getContainerDetails, getContainerLogs, getContainers, removeContainer, startContainer, stopContainer } from './containerController';

const router = Router();

// Endpoints container
// GET /api/containers
router.get('/', getContainers);

// GET /api/containers/id
router.get('/:id', getContainerDetails);

// POST /api/containers/:id/start
router.post('/:id/start', startContainer);

// POST /api/containers/:id/stop
router.post('/:id/stop', stopContainer);

// GET /apu/containers/:id/logs
router.get('/:id/logs', getContainerLogs);

// DELETE /api/containers/:id
router.delete('/:id', removeContainer);

export default router;