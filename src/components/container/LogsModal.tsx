import { X, Terminal, RefreshCw } from 'lucide-react';
import { ContainerLogs } from '../../utils/RenderContainerLogs';
import { useContainerLogs } from '../../hooks/useContainerLogs';
import { useEffect, useRef } from 'react';



interface LogsModalProps {
  isOpen: boolean;
  containerName: string;
  containerId: string;
  onClose: () => void;
}

export function LogsModal({
  isOpen,
  containerName,
  containerId,
  onClose
}: LogsModalProps) {
  const {containerLogs, isLoading} = useContainerLogs(containerId, isOpen);
  const logsEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [containerLogs, isOpen]);

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091413]/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-5xl h-[85vh] rounded-2xl border border-[#408A71]/50 bg-[#091413] shadow-2xl flex flex-col overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#408A71]/30 bg-[#285A48]/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#408A71]/30 text-[#B0E4CC] border border-[#408A71]/40">
              <Terminal className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Container Logs:</span>
                <span className="text-[#B0E4CC] font-mono">{containerName}</span>
              </h3>
              <p className="text-xs text-gray-400 font-mono">ID: {containerId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-rose-500/20 transition-colors cursor-pointer ml-2"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-black/70 font-mono select-text space-y-0.5">
          {isLoading && !containerLogs ? (
            <div className="h-full flex flex-col items-center justify-center text-[#B0E4CC] gap-3">
              <RefreshCw className="size-8 animate-spin" />
              <p className="text-sm font-medium">Loading container logs...</p>
            </div>
          ) : (
            <>
              <ContainerLogs rawLogs={containerLogs} />
              <div ref={logsEndRef} />
            </>
          )}
        </div>

        <div className="px-6 py-2.5 border-t border-[#408A71]/30 bg-[#285A48]/10 flex justify-between items-center text-xs text-gray-400 font-mono">
          <span>Stream output | Errors highlighted in red</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-gray-200 bg-[#408A71]/30 border border-[#408A71]/40 hover:bg-[#408A71] hover:text-white rounded-lg transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}