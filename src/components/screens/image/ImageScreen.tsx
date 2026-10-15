import { RefreshCw, HardDrive, SearchXIcon } from "lucide-react";
import { useImages } from "../../../hooks/useImages";
import { useState } from "react";

export function ImagesScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const { images, isLoading, isError } = useImages();

  const filteredImages = images?.filter((img) => {
    const matchesSearch = img.tags.some((tag) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#B0E4CC]">Docker Images</h1>
          <p className="text-sm text-gray-300">
            Overview of local container images and active container bindings.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh] text-[#B0E4CC]">
          <RefreshCw className="size-8 animate-spin mr-3" />
          <span className="text-lg font-medium">Loading docker images...</span>
        </div>
      ) : isError ? (
        <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200">
          Failed to load images from the Docker daemon.
        </div>
      ) : images && images.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-[#408A71]/40 bg-[#285A48]/30 backdrop-blur-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search images by tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 px-4 py-2.5 pl-10 rounded-xl bg-[#285A48]/30 border border-[#408A71]/40 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#B0E4CC] transition-colors"
            />
          </div>
          <table className="w-full text-left text-sm text-gray-200">
            <thead className="bg-[#285A48] text-xs uppercase tracking-wider text-[#B0E4CC] border-b border-[#408A71]/40">
              <tr>
                <th className="px-6 py-4">Image Tags</th>
                <th className="px-6 py-4">Image ID</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Connected Containers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#408A71]/20">
              {filteredImages?.map((img) => (
                <tr
                  key={img.id}
                  className="hover:bg-[#408A71]/15 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {img.tags.map((tag, idx) => (
                        <div
                          key={idx}
                          className="font-mono text-xs bg-[#091413]/60 px-2.5 py-1 rounded border border-[#408A71]/30 text-emerald-200 inline-block mr-1.5"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-mono text-xs text-gray-400">
                    {img.shortId}
                  </td>

                  {/* Size */}
                  <td className="px-6 py-4 font-mono text-xs text-[#B0E4CC]">
                    {img.size}
                  </td>

                  <td className="px-6 py-4">
                    {img.containers.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {img.containers.map((c) => (
                          <span
                            key={c.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#408A71]/30 border border-[#408A71]/50 text-xs text-white font-medium"
                          >
                            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                            {c.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs italic">
                        Not in use
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 bg-[#285A48]/15 rounded-xl border border-[#408A71]/30">
          <HardDrive className="size-10 mx-auto text-[#408A71] mb-2" />
          <p className="font-medium text-gray-300">No images found</p>
          <p className="text-xs text-gray-500 mt-1">
            There are no Docker images stored on this machine.
          </p>
        </div>
      )}
    </div>
  );
}
