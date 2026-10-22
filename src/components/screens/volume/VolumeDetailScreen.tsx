import { useNavigate, useParams } from "react-router-dom";
import { useVolume } from "../../../hooks/volume/useVolume";
import { ArrowLeft, Container, Database, HardDrive, RefreshCw } from "lucide-react";


export function VolumeDetailScreen() {
  const { name } = useParams();
  const {volume, isLoading, isError} = useVolume(name!); 
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-[#B0E4CC]">
        <RefreshCw className="size-8 animate-spin mr-3" />
        <span className="text-lg font-medium">Loading volume details...</span>
      </div>
    );
  }

  if (isError || !volume) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <button
          onClick={() => navigate('/volumes')}
          className="flex items-center gap-2 text-sm text-[#B0E4CC] hover:underline cursor-pointer"
        >
          <ArrowLeft className="size-4" /> Back to Volumes
        </button>
        <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200">
          <p className="font-semibold">Failed to load volume details:</p>
          <p className="text-sm mt-1">Volume not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/volumes')}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#408A71]/30 hover:bg-[#408A71]/50 text-gray-200 text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Volumes</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl border border-[#408A71]/40 bg-gradient-to-r from-[#285A48] to-[#091413] shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#408A71]/30 text-[#B0E4CC]">
            <Database className="size-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-mono">{volume.name}</h1>
            <p className="text-xs text-gray-300 font-mono mt-0.5">Driver: {volume.driver}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-[#408A71]/30 bg-[#285A48]/30 space-y-4">
          <div className="flex items-center gap-2 text-[#B0E4CC] font-bold text-base border-b border-[#408A71]/30 pb-3">
            <HardDrive className="size-5" />
            <h2>Volume Specifications</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-400 block text-xs">Mountpoint (Host Path)</span>
              <span className="font-mono text-emerald-200 bg-[#091413]/60 px-2.5 py-1.5 rounded border border-[#408A71]/30 block mt-1 truncate" title={volume.mountpoint}>
                {volume.mountpoint}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-gray-400 block text-xs">Access Mode</span>
                <span className="font-mono text-gray-200">{volume.rw ? 'Read/Write (rw)' : 'Read-Only (ro)'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Type</span>
                <span className="font-mono text-gray-200 uppercase">{volume.type}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-[#408A71]/30 bg-[#285A48]/30 space-y-4">
          <div className="flex items-center gap-2 text-[#B0E4CC] font-bold text-base border-b border-[#408A71]/30 pb-3">
            <Container className="size-5" />
            <h2>Connected Containers</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {volume.containers && volume.containers.length > 0 ? (
              volume.containers.map((c: { id: string; name: string }) => (
                <span
                  key={c.id}
                  className="px-3 py-1.5 rounded-lg bg-[#091413]/60 border border-[#408A71]/30 text-xs font-mono text-[#B0E4CC]"
                >
                  {c.name}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-xs italic">
                No active containers using this volume
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}