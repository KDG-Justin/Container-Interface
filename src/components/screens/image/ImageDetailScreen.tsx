import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Layers,
  RefreshCw,
  HardDrive,
  Calendar,
  Container,
  Eye,
  EyeOff,
  Terminal,
  Trash2,
} from "lucide-react";
import { useImage } from "../../../hooks/image/useImage";
import { DeleteConfirmationModal } from "../../container/DeleteConformationModal";

export function ImageDetailScreen() {
  const { id } = useParams<string>();
  const { image, isLoading, isError, removeImage } = useImage(id!);
  const navigate = useNavigate();
  const [showId, setShowId] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemove = async () => {
    removeImage(id!);
    setIsDeleting(true);
    navigate(`/images`);
  };

  const handleDeleteModal = () => {
    setDeleteModalOpen(true); 
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-[#B0E4CC]">
        <RefreshCw className="size-8 animate-spin mr-3" />
        <span className="text-lg font-medium">Loading image details...</span>
      </div>
    );
  }

  if (isError || !image) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <button
          onClick={() => navigate("/images")}
          className="flex items-center gap-2 text-sm text-[#B0E4CC] hover:underline cursor-pointer"
        >
          <ArrowLeft className="size-4" /> Back to Images
        </button>
        <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200">
          <p className="font-semibold">Failed to load image details:</p>
        </div>
      </div>
    );
  }

  const tags = image.tags || ["<none>:<none>"];
  const rawId = image.id.replace("sha256:", "");
  const maskedId = `${rawId.substring(0, 4)}••••••••${rawId.substring(rawId.length - 4)}`;
  const canDelete = image.containers.length === 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/images")}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#408A71]/30 hover:bg-[#408A71]/50 text-gray-200 text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Images</span>
        </button>

        {canDelete ? (
          <button
            onClick={handleDeleteModal}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            <span>{isDeleting ? "Deleting..." : "Delete Image"}</span>
          </button>
        ) : (
          <span className="text-xs text-gray-400 bg-[#285A48]/20 px-3 py-1.5 rounded-lg border border-[#408A71]/20">
            Cannot delete (in use by active containers)
          </span>
        )}
      </div>

      <div className="p-6 rounded-2xl border border-[#408A71]/40 bg-gradient-to-r from-[#285A48] to-[#091413] shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#408A71]/30 text-[#B0E4CC]">
              <Layers className="size-8" />
            </div>
            <div>
              <div className="flex flex-wrap gap-2 mb-1">
                {tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="font-mono text-xs bg-[#091413]/70 px-2.5 py-1 rounded border border-[#408A71]/40 text-emerald-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-300 font-mono tracking-wider">
                  ID: {showId ? rawId : maskedId}
                </span>
                <button
                  onClick={() => setShowId(!showId)}
                  title={showId ? "Hide Image ID" : "Show Image ID"}
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
            <Calendar className="size-4 text-[#B0E4CC]" />
            <span>Created: {image.created}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-[#408A71]/30 bg-[#285A48]/30 space-y-4">
          <div className="flex items-center gap-2 text-[#B0E4CC] font-bold text-base border-b border-[#408A71]/30 pb-3">
            <HardDrive className="size-5" />
            <h2>Image Specifications</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400 block text-xs">Total Size</span>
              <span className="font-mono text-emerald-200 font-semibold">
                {image.size}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs">
                Architecture / OS
              </span>
              <span className="font-mono text-gray-200">
                {image.architecture} / {image.os}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs">
                Docker Version
              </span>
              <span className="font-mono text-gray-200">
                {image.dockerVersion}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-[#408A71]/30 bg-[#285A48]/30 space-y-4">
          <div className="flex items-center gap-2 text-[#B0E4CC] font-bold text-base border-b border-[#408A71]/30 pb-3">
            <Container className="size-5" />
            <h2>Connected Containers</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {image.containers && image.containers.length > 0 ? (
              image.containers.map((c: { id: string; name: string }) => (
                <span
                  key={c.id}
                  className="px-3 py-1.5 rounded-lg bg-[#091413]/60 border border-[#408A71]/30 text-xs font-mono text-[#B0E4CC]"
                >
                  {c.name}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-xs italic">
                No active containers using this image
              </span>
            )}
          </div>
        </div>

        <div className="md:col-span-2 p-6 rounded-xl border border-[#408A71]/30 bg-[#285A48]/30 space-y-4">
          <div className="flex items-center gap-2 text-[#B0E4CC] font-bold text-base border-b border-[#408A71]/30 pb-3">
            <Terminal className="size-5" />
            <h2>Image Layers (History)</h2>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-2 font-mono text-xs pr-2">
            {image.history && image.history.length > 0 ? (
              image.history.map((layer, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-[#091413]/50 border border-[#408A71]/20 flex justify-between items-center"
                >
                  <span className="text-[#B0E4CC] truncate mr-4">
                    {layer.createdBy}
                  </span>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap bg-[#285A48]/40 px-2 py-0.5 rounded">
                    {layer.sizeFormatted}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-gray-400 text-xs">
                No layer history available
              </span>
            )}
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        name={image.tags[0]}
        onClose={() => {
          setDeleteModalOpen(false);
          setIsDeleting(false); 
        }}
        onConfirm={handleRemove}
        isDeleting={isDeleting}
      />
    </div>
  );
}
