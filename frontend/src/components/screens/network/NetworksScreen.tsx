import { useState } from "react";
import { useNetworks } from "../../../hooks/network/useNetworks";
import { DeleteConfirmationModal } from "../../container/DeleteConformationModal";
import { Globe, Network, RefreshCw, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NetworksScreen() {
  const navigate = useNavigate();
  const { networks, isLoading, isError, removeNetwork } = useNetworks();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [targetNetwork, setTargetNetwork] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const filteredNetworks = networks?.filter((net) =>
    net.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openDeleteModal = (id: string, name: string) => {
    setTargetNetwork({ id, name });
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTargetNetwork(null);
    setIsDeleting(false);
    setDeleteModalOpen(false);
  };

  const handleRemove = async () => {
    if (!targetNetwork) return;

    try {
      setIsDeleting(true);
      await removeNetwork(targetNetwork.id);
      setTargetNetwork(null);
      setDeleteModalOpen(false);
    } catch (err) {
      console.error("Failed to remove network:", err);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#B0E4CC]">Docker Networks</h1>
          <p className="text-sm text-gray-300">
            Manage container bridge, overlay, and custom network topologies.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh] text-[#B0E4CC]">
          <RefreshCw className="size-8 animate-spin mr-3" />
          <span className="text-lg font-medium">
            Loading docker networks...
          </span>
        </div>
      ) : isError ? (
        <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200">
          Failed to load networks from the Docker daemon.
        </div>
      ) : filteredNetworks && filteredNetworks.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-[#408A71]/40 bg-[#285A48]/30 backdrop-blur-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search network by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 mb-2 mt-2 ml-2 px-4 py-2.5 pl-10 rounded-xl bg-[#285A48]/30 border border-[#408A71]/40 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#B0E4CC] transition-colors"
            />
          </div>
          <table className="w-full text-left text-sm text-gray-200">
            <thead className="bg-[#285A48] text-xs uppercase tracking-wider text-[#B0E4CC] border-b border-[#408A71]/40">
              <tr>
                <th className="px-6 py-4">Network Name</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Subnet / Gateway</th>
                <th className="px-6 py-4">Connected Containers</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#408A71]/20">
              {filteredNetworks.map((net) => {
                const inUse = net.containers.length > 0;

                return (
                  <tr
                    key={net.id}
                    className="hover:bg-[#408A71]/15 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-semibold text-white text-base">
                        <Network className="size-4 text-[#B0E4CC]" />
                        <span>{net.name}</span>
                      </div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        ID: {net.shortId}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs">
                      <span className="bg-[#091413]/60 px-2.5 py-1 rounded border border-[#408A71]/30 text-emerald-200">
                        {net.driver}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-gray-300 space-y-0.5">
                      <div>Sub: {net.subnet}</div>
                      <div className="text-gray-400 text-[11px]">
                        GW: {net.gateway}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {inUse ? (
                        <div className="flex flex-wrap gap-1.5">
                          {net.containers.map(
                            (c: { id: string; name: string }) => (
                              <span
                                key={c.id}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#408A71]/30 border border-[#408A71]/50 text-xs text-[#B0E4CC] font-mono"
                                onClick={() => navigate(`/containers/${c.id}`)}
                              >
                                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {c.name}
                              </span>
                            ),
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs italic">
                          Unused
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {net.isSystem ? (
                        <span className="text-[11px] text-gray-400 italic">
                          System Network
                        </span>
                      ) : net.containers.length > 0 ? (
                        <span className="text-[11px] text-gray-400 italic">
                          In use
                        </span>
                      ) : (
                        <button
                          onClick={() => openDeleteModal(net.id, net.name)}
                          title="Remove network"
                          className="p-2 rounded-lg bg-rose-900/40 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 bg-[#285A48]/15 rounded-xl border border-[#408A71]/30">
          <Globe className="size-10 mx-auto text-[#408A71] mb-2" />
          <p className="font-medium text-gray-300">No networks found</p>
          <p className="text-xs text-gray-500 mt-1">
            There are no Docker networks matching your search.
          </p>
        </div>
      )}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        name={targetNetwork?.name || ""}
        onClose={closeDeleteModal}
        onConfirm={handleRemove}
        isDeleting={isDeleting}
      />
    </div>
  );
}
