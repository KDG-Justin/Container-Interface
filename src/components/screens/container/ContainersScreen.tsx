import { useState } from "react";
import {
  Play,
  Square,
  Info,
  Terminal,
  RefreshCw,
  Trash2,
  Loader2,
} from "lucide-react";
import { DeleteConfirmationModal } from "../../../components/container/DeleteConformationModal";
import { useContainers } from "../../../hooks/container/useContainers";
import { useNavigate } from "react-router-dom";
import { LogsModal } from "../../container/LogsModal";

export function ContainersScreen() {
  const navigate = useNavigate();
  const [activeActionId, setActiveActionId] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [targetContainer, setTargetContainer] = useState<{id: string; name: string;} | null>();
  const {containers, isLoading, isError, startContainer, stopContainer, removeContainer,} = useContainers();

  const handleStart = async (id: string) => {
    try {
      setActiveActionId(id);
      await startContainer(id);
    } catch (err) {
      console.error("Failed to start container:", err);
    } finally {
      setActiveActionId("");
    }
  };

  const handleStop = async (id: string) => {
    try {
      setActiveActionId(id);
      await stopContainer(id);
    } catch (err) {
      console.error("Failed to stop container:", err);
    } finally {
      setActiveActionId("");
    }
  };

  const openDeleteModal = (id: string, name: string) => {
    setTargetContainer({ id, name });
    setDeleteModalOpen(true);
  };

  const openLogsModal = (id: string, name: string) => {
    setTargetContainer({ id, name });
    setLogsModalOpen(true);
  };

  const handleRemove = async () => {
    if (!targetContainer) return;

    try {
      setActiveActionId(targetContainer.id);
      await removeContainer(targetContainer.id);
      setDeleteModalOpen(false);
      setTargetContainer(null);
    } catch (err) {
      console.error("Failed to remove container:", err);
    } finally {
      setActiveActionId("");
    }
  };

  const filteredContainers = containers?.filter((container) => {
    const matchesSearch = container.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#B0E4CC]">Containers</h1>
          <p className="text-sm text-gray-300">
            Available docker container on local machine.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-16 text-[#B0E4CC]">
          <RefreshCw className="size-8 animate-spin mr-3" />
          <span className="text-lg font-medium">Getting containers...</span>
        </div>
      )}

      {isError && (
        <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200">
          <p className="font-semibold">Error with getting containers:</p>
          <p className="text-sm mt-1">Docker desktop might be offline.</p>
        </div>
      )}

      {!isLoading && !isError && containers?.length === 0 && (
        <div className="text-center py-12 border border-[#408A71]/30 rounded-xl bg-[#285A48]/20">
          <p className="text-gray-300">No containers found.</p>
        </div>
      )}

      {!isLoading && !isError && containers && containers.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-[#408A71]/40 bg-[#285A48]/30 backdrop-blur-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search container by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 mb-2 px-4 py-2.5 pl-10 rounded-xl bg-[#285A48]/30 border border-[#408A71]/40 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#B0E4CC] transition-colors"
            />
          </div>
          <table className="w-full text-left text-sm text-gray-200">
            <thead className="bg-[#285A48] text-xs uppercase tracking-wider text-[#B0E4CC] border-b border-[#408A71]/40">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Name & ID</th>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Ports</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#408A71]/20">
              {filteredContainers?.map((container) => {
                const isRunning = container.state === "running";
                const isProcessing = activeActionId === container.id;

                return (
                  <tr
                    key={container.id}
                    className="hover:bg-[#408A71]/15 transition-colors"
                  >
                    {/* status badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          isRunning
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        }`}
                      >
                        <span
                          className={`size-2 rounded-full ${
                            isRunning
                              ? "bg-emerald-400 animate-pulse"
                              : "bg-rose-400"
                          }`}
                        />
                        {container.state}
                      </span>
                    </td>

                    {/* container name + id */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white text-base">
                        {container.name}
                      </div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        ID: {container.id}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-[#091413]/60 px-2.5 py-1 rounded border border-[#408A71]/30 text-emerald-200">
                        {container.image}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-gray-300">
                      {container.ports !== "-" ? (
                        <span className="text-[#B0E4CC]">
                          {container.ports}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isProcessing ? (
                          <div className="p-2 text-[#B0E4CC]">
                            <Loader2 className="size-4 animate-spin" />
                          </div>
                        ) : (
                          <>
                            {isRunning ? (
                              <button
                                onClick={() => handleStop(container.id)}
                                title="Stop container"
                                className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                              >
                                <Square className="size-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStart(container.id)}
                                title="Start container"
                                className="p-2 rounded-lg bg-[#B0E4CC] text-[#091413] hover:bg-emerald-300 font-bold transition-colors cursor-pointer"
                              >
                                <Play className="size-4 fill-current" />
                              </button>
                            )}

                            {!isRunning && (
                              <button
                                onClick={() =>
                                  openDeleteModal(container.id, container.name)
                                }
                                title="Remove container"
                                className="p-2 rounded-lg bg-rose-900/40 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            )}
                          </>
                        )}

                        <button
                          title="View logs"
                          className="p-2 rounded-lg bg-[#408A71]/40 text-gray-200 hover:bg-[#408A71] hover:text-white transition-colors cursor-pointer"
                          onClick={() =>
                            openLogsModal(container.id, container.name)
                          }
                        >
                          <Terminal className="size-4" />
                        </button>

                        <button
                          title="Inspect details"
                          className="p-2 rounded-lg bg-[#408A71]/40 text-gray-200 hover:bg-[#408A71] hover:text-white transition-colors cursor-pointer"
                          onClick={() =>
                            navigate(`/containers/${container.id}`)
                          }
                        >
                          <Info className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        name={targetContainer?.name || ""}
        onClose={() => {
          setDeleteModalOpen(false);
          setTargetContainer(null);
        }}
        onConfirm={handleRemove}
        isDeleting={activeActionId === targetContainer?.id}
      />
      <LogsModal
        isOpen={logsModalOpen}
        containerName={targetContainer?.name || ""}
        containerId={targetContainer?.id || ""}
        onClose={() => {
          setLogsModalOpen(false);
          setTargetContainer(null);
        }}
      />
    </div>
  );
}
