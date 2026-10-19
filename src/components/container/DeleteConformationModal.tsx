import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  name: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  name,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091413]/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-[#408A71]/50 bg-[#285A48] p-6 shadow-2xl space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <AlertTriangle className="size-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Remove docker resource</h3>
              <p className="text-xs text-gray-300">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#408A71]/40 transition-colors disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/*content */}
        <p className="text-sm text-gray-200 leading-relaxed">
          Are you sure you want to remove {" "}
          <span className="font-semibold text-[#B0E4CC] font-mono px-1.5 py-0.5 rounded bg-[#091413]/60 border border-[#408A71]/30">
            {name}
          </span>
          ?
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 text-sm font-semibold text-gray-200 bg-[#091413]/60 border border-[#408A71]/40 hover:bg-[#091413] hover:text-white rounded-xl transition-all disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            {isDeleting ? "Removing..." : "Yes, Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}
