import { useState } from "react";
import { useVolumes } from "../../../hooks/volume/useVolumes";
import { Database, HardDrive, RefreshCw, Trash2 } from "lucide-react";
import { DeleteConfirmationModal } from "../../container/DeleteConformationModal";
import { useNavigate } from "react-router-dom";

export function VolumesScreen() {
  const {volumes, isLoading, isError, removeVolume} = useVolumes();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [targetVolume, setTargetVolume] = useState<string>("");
  const navigate = useNavigate();

  const filteredVolumes = volumes?.filter((vol) => {
    const matchesSearch = vol.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });


  const openDeleteModal = (name: string) => {
    setTargetVolume(name); 
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTargetVolume(""); 
    setIsDeleting(false); 
    setDeleteModalOpen(false); 
  }

  const handleRemove = async () => {
    if (!targetVolume) return;

    try {
      setIsDeleting(true); 
      await removeVolume(targetVolume);
      setTargetVolume(""); 
      setDeleteModalOpen(false);
    } catch (err) {
      console.error("Failed to remove container:", err);
    } 
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#B0E4CC]">Docker Volumes</h1>
          <p className="text-sm text-gray-300">
            Manage persistent data volumes and container mountpoints.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh] text-[#B0E4CC]">
          <RefreshCw className="size-8 animate-spin mr-3" />
          <span className="text-lg font-medium">Loading docker volumes...</span>
        </div>
      ) : isError ? (
        <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200">
          Failed to load volumes from the Docker daemon.
        </div>
      ) : filteredVolumes && filteredVolumes.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-[#408A71]/40 bg-[#285A48]/30 backdrop-blur-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search container by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 mb-2 mt-2 ml-2 px-4 py-2.5 pl-10 rounded-xl bg-[#285A48]/30 border border-[#408A71]/40 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#B0E4CC] transition-colors"
            />
          </div>
          <table className="w-full text-left text-sm text-gray-200">
            <thead className="bg-[#285A48] text-xs uppercase tracking-wider text-[#B0E4CC] border-b border-[#408A71]/40">
              <tr>
                <th className="px-6 py-4">Volume Name</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Mountpoint</th>
                <th className="px-6 py-4">Connected Containers</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#408A71]/20">
              {filteredVolumes.map((vol) => {
                const inUse = vol.containers.length > 0;

                return (
                  <tr
                    key={vol.name}
                    className="hover:bg-[#408A71]/15 transition-colors"
                    onClick={() => navigate(`/volumes/${vol.name}`)}
                  >
                    <td className="px-6 py-4 font-mono font-semibold text-white text-xs">
                      <div className="flex items-center gap-2">
                        <Database className="size-4 text-[#B0E4CC]" />
                        <span className="truncate max-w-xs">{vol.name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-gray-300">
                      <span className="bg-[#091413]/60 px-2.5 py-1 rounded border border-[#408A71]/30 text-emerald-200">
                        {vol.driver}
                      </span>
                    </td>

                    <td
                      className="px-6 py-4 font-mono text-xs text-gray-400 max-w-xs truncate"
                      title={vol.mountpoint}
                    >
                      {vol.mountpoint}
                    </td>

                    <td className="px-6 py-4">
                      {inUse ? (
                        <div className="flex flex-wrap gap-1.5">
                          {vol.containers.map(
                            (c: { id: string; name: string }) => (
                              <span
                                key={c.id}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#408A71]/30 border border-[#408A71]/50 text-xs text-[#B0E4CC] font-mono"
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
                      {!inUse ? (
                        <button
                          onClick={() => openDeleteModal(vol.name)}
                          title="Remove volume"
                          className="p-2 rounded-lg bg-rose-900/40 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">
                          In use
                        </span>
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
          <HardDrive className="size-10 mx-auto text-[#408A71] mb-2" />
          <p className="font-medium text-gray-300">No volumes found</p>
          <p className="text-xs text-gray-500 mt-1">
            There are no Docker volumes.
          </p>
        </div>
      )}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        name={targetVolume || ""}
        onClose={closeDeleteModal}
        onConfirm={handleRemove}
        isDeleting={isDeleting}
      />
    </div>
  );
}
