import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Container,
  Database,
  Eye,
  EyeOff,
  ImageIcon,
  Layers,
  Network,
  RefreshCcw,
} from "lucide-react";
import { useState } from "react";
import { useContainer } from "../../../hooks/container/useContainer";

export function ContainerDetailScreen() {
  const { id } = useParams<string>();
  const navigate = useNavigate();
  const { container, isLoading, isError } = useContainer(id!);
  const [showId, setShowId] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-[#B0E4CC]">
        <RefreshCcw className="size-8 animate-spin mr-3" />
        <span className="text-lg font-medium">
          Loading container details...
        </span>
      </div>
    );
  }

  if (isError || !container) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <button
          onClick={() => navigate("/containers")}
          className="flex items-center gap-2 text-sm text-[#B0E4CC] hover:underline cursor-pointer"
        >
          <ArrowLeft className="size-4" /> Back to Containers
        </button>
        <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200">
          <p className="font-semibold">Failed to load container details:</p>
          <p className="text-sm mt-1">{"Container not found."}</p>
        </div>
      </div>
    );
  }

  const isRunning = container.state === "running";
  const createdTime = container.created
    ? new Date(container.created).toLocaleString()
    : "Unknown";
  // vb toont de eerste 4 en laatste 4 tekens met sterretjes dazrtussen)
  const maskedId = container.id
    ? `${container.id.substring(0, 4)}••••••••${container.id.substring(container.id.length - 4)}`
    : "";

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/containers")}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#408A71]/30 hover:bg-[#408A71]/50 text-gray-200 text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Containers</span>
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isRunning
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
            }`}
          >
            <span
              className={`size-2 rounded-full ${isRunning ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}
            />
            {container.state || (isRunning ? "running" : "stopped")}
          </span>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-[#408A71]/40 bg-gradient-to-r from-[#285A48] to-[#091413] shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#408A71]/30 text-[#B0E4CC]">
              <Container className="size-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {container.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-300 font-mono tracking-wider">
                  ID: {showId ? container.id : maskedId}
                </span>
                <button
                  onClick={() => setShowId(!showId)}
                  title={showId ? "Hide Container ID" : "Show Container ID"}
                  className="p-1 rounded-md text-[#B0E4CC] hover:bg-[#408A71]/30 transition-colors cursor-pointer"
                >
                  {showId ? (
                    <EyeOff className="size-3.5" />
                  ) : (
                    <Eye className="size-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-300">
          <div className="flex items-center gap-1.5 bg-[#091413]/50 px-3 py-2 rounded-lg border border-[#408A71]/30">
            <Clock className="size-4 text-[#B0E4CC]" />
            <span>Created: {createdTime}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-[#408A71]/30 bg-[#285A48]/30 space-y-4">
          <div className="flex items-center gap-2 text-[#B0E4CC] font-bold text-base border-b border-[#408A71]/30 pb-3">
            <ImageIcon className="size-5" />
            <h2>Image Information</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400 block text-xs">Image Tag</span>
              <span className="font-mono text-emerald-200 bg-[#091413]/60 px-2 py-1 rounded border border-[#408A71]/30 inline-block mt-1">
                {container.image}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-[#408A71]/30 bg-[#285A48]/30 space-y-4">
          <div className="flex items-center gap-2 text-[#B0E4CC] font-bold text-base border-b border-[#408A71]/30 pb-3">
            <Network className="size-5" />
            <h2>Networks & Ports</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-400 block text-xs mb-1">
                Connected Networks
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(container.networks).length > 0 ? (
                  Object.keys(container.networks).map((netName) => (
                    <span
                      key={netName}
                      className="px-2.5 py-1 rounded bg-[#091413]/60 border border-[#408A71]/30 text-xs font-mono text-[#B0E4CC]"
                    >
                      {netName}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">
                    No networks attached
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-gray-400 block text-xs mb-1">
                Port Bindings
              </span>
              <div>
                {container.portsDetail && Object.keys(container.portsDetail).length > 0 ? (
                  Object.keys(container.portsDetail).map((containerPort) => {
                    const binding = container.portsDetail[containerPort];
                    const hostPort = binding?.[0]?.HostPort
                      ? `${binding[0].HostPort}:${containerPort}`
                      : containerPort;
                    return (
                      <span
                        key={containerPort}
                        className="inline-block mr-2 px-2.5 py-1 rounded bg-[#091413]/60 border border-[#408A71]/30 text-xs font-mono text-emerald-200"
                      >
                        {hostPort}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-gray-400 text-xs">
                    No ports exposed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-[#408A71]/30 bg-[#285A48]/30 space-y-4">
          <div className="flex items-center gap-2 text-[#B0E4CC] font-bold text-base border-b border-[#408A71]/30 pb-3">
            <Database className="size-5" />
            <h2>Storage Volumes (Mounts)</h2>
          </div>
          <div className="space-y-2 text-sm">
            {container.mounts && container.mounts.length > 0 ? (
              container.mounts.map((mount, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#091413]/50 border border-[#408A71]/30 space-y-1"
                >
                  <div className="text-xs text-gray-400">
                    Type:{" "}
                    <span className="text-white uppercase">{mount.type}</span>
                    {mount.driver && (
                      <span className="ml-2 text-gray-500">
                        ({mount.driver})
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-emerald-200 truncate">
                    Source: {mount.source}
                  </div>
                  <div className="text-xs font-mono text-gray-300 truncate">
                    Destination: {mount.destination}
                  </div>
                  <div className="text-[10px] text-gray-400 pt-1">
                    Access: {mount.rw ? "Read/Write (rw)" : "Read-Only (ro)"}
                  </div>
                </div>
              ))
            ) : (
              <span className="text-gray-400 text-xs">No volumes mounted</span>
            )}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-[#408A71]/30 bg-[#285A48]/30 space-y-4">
          <div className="flex items-center gap-2 text-[#B0E4CC] font-bold text-base border-b border-[#408A71]/30 pb-3">
            <Layers className="size-5" />
            <h2>Environment Variables</h2>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1 font-mono text-xs pr-2">
            {container.env.length > 0 ? (
              container.env.map((env: string, idx: number) => (
                <div
                  key={idx}
                  className="p-1.5 rounded bg-[#091413]/50 border border-[#408A71]/20 text-gray-200 truncate"
                >
                  {env}
                </div>
              ))
            ) : (
              <span className="text-gray-400 text-xs">
                No environment variables set
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
