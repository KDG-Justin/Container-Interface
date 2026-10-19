import Docker from "dockerode";

// Mverbinding met lokale docker daemon socket
const docker = new Docker({
  socketPath: process.env.DOCKER_SOCKET ?? "/var/run/docker.sock",
});

export default docker;
