import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Play, Layers, Database, Cpu, Globe } from 'lucide-react';
import { useImages } from '../../hooks/image/useImages';
import { useVolumes } from '../../hooks/volume/useVolumes';
import type { ContainerFormData } from '../../model/Container';
import { useContainers } from '../../hooks/container/useContainers';

interface AddContainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddContainerModal({ isOpen, onClose }: AddContainerModalProps) {
  const [errorMsg, setErrorMsg] = useState('');
  const {images} = useImages(); 
  const {createContainer} = useContainers(); 
  const {volumes} = useVolumes(); 
  const {register, handleSubmit, reset, formState: { errors }} = useForm<ContainerFormData>();


  const handleClose = () => {
    reset();
    setErrorMsg('');
    onClose();
  };

  const onSubmit = (data: ContainerFormData) => {
    setErrorMsg('');
    createContainer.mutate(
      {
        name: data.name?.trim(),
        image: data.image,
        port: data.port?.trim() || undefined,
        volume: data.volume || undefined,
      },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (err: any) => {
          setErrorMsg(err.response?.data?.message || 'Failed to create container.');
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#408A71]/50 bg-[#091413] p-6 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-[#408A71]/30 pb-4">
          <div className="flex items-center gap-2 text-[#B0E4CC]">
            <Play className="size-5 fill-[#B0E4CC]" />
            <h2 className="text-lg font-bold">Deploy New Container</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="size-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-900/40 border border-rose-500/50 rounded-lg text-rose-200 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Cpu className="size-3.5 text-[#B0E4CC]" />
              Container Name *
            </label>
            <input
              type="text"
              placeholder="e.g. my-web-server"
              {...register('name')}
              className="w-full px-3 py-2 rounded-xl bg-[#285A48]/20 border border-[#408A71]/40 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#B0E4CC]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Layers className="size-3.5 text-[#B0E4CC]" />
              Docker Image *
            </label>
            <select
              {...register('image', { required: 'Please select an image.' })}
              className="w-full px-3 py-2 rounded-xl bg-[#285A48]/20 border border-[#408A71]/40 text-sm text-white focus:outline-none focus:border-[#B0E4CC]"
            >
              <option value="" disabled>-- Select a local image --</option>
              {images?.map((img: any) => {
                const tag = img.tags?.[0] || img.fullId;
                return (
                  <option key={img.fullId} value={tag} className="bg-[#091413] text-white">
                    {tag}
                  </option>
                );
              })}
            </select>
            {errors.image && (
              <span className="text-xs text-rose-400">{errors.image.message}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Globe className="size-3.5 text-[#B0E4CC]" />
              Port Mapping (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 8080:80 (Host:Container)"
              {...register('port')}
              className="w-full px-3 py-2 rounded-xl bg-[#285A48]/20 border border-[#408A71]/40 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#B0E4CC] font-mono"
            />
            <p className="text-[11px] text-gray-400">Format: HostPort:ContainerPort</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Database className="size-3.5 text-[#B0E4CC]" />
              Attach Volume (Optional)
            </label>
            <select
              {...register('volume')}
              className="w-full px-3 py-2 rounded-xl bg-[#285A48]/20 border border-[#408A71]/40 text-sm text-white focus:outline-none focus:border-[#B0E4CC]"
            >
              <option value="" className="text-gray-500">-- None --</option>
              {volumes?.map((vol: any) => (
                <option key={vol.name} value={vol.name} className="bg-[#091413] text-white">
                  {vol.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#408A71]/30">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-[#285A48]/30 hover:bg-[#285A48]/50 text-gray-200 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createContainer.isPending}
              className="px-5 py-2 rounded-xl bg-[#B0E4CC] hover:bg-[#408A71] text-[#091413] text-sm font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Play className="size-4 fill-[#091413]" />
              <span>{createContainer.isPending ? 'Deploying...' : 'Deploy Container'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}