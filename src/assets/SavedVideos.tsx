import { useEffect, useState } from "react";

export default function SavedVideos() {
  const [videos, setVideos] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("savedVideos");
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const openInExplorer = (path: string) => {
    window.ipcRenderer?.invoke("open-in-explorer", path);
  };

  useEffect(() => {
    async function verifyVideos() {
      if (!window.ipcRenderer) return;

      const results = await Promise.all(
        videos.map(async (path) => {
          const exists = await window.ipcRenderer.invoke("check-file-exists", path);
          return exists ? path : null;
        })
      );

      const filtered = results.filter(Boolean) as string[];
      setVideos(filtered);
      localStorage.setItem("savedVideos", JSON.stringify(filtered));
    }

    verifyVideos();
  }, []);

  useEffect(() => {
    if (!window.ipcRenderer) return;

    const handleDone = (_event: any, data: any) => {
      let path: string | undefined;

      if (typeof data === "string") path = data;
      else if (typeof data === "object" && data !== null) {
        path = data.outputPath ?? data.path;
      }

      if (!path) return;

      setVideos((prev) => {
        if (prev.includes(path)) return prev;
        const next = [...prev, path];
        localStorage.setItem("savedVideos", JSON.stringify(next));
        return next;
      });
    };

    window.ipcRenderer.on("compression-done", handleDone);

    return () => {
      window.ipcRenderer?.off?.("compression-done", handleDone);
    };
  }, []);

  return (
    <div className="flex flex-col w-[70vw]">
      <h1 className="text-white border-b-1 bg-dlurple indent-3 font-semibold text-base/10 border-dlurple rounded-t-xl">
        Saved Videos
      </h1>

      <div className="bg-nqb h-[30vh] rounded-b-xl p-3 overflow-auto">
        {videos.length === 0 ? (
          <div className="text-sm text-gray-300">No saved videos yet</div>
        ) : (
          videos.map((path, idx) => (
            <div
              key={path}
              className="text-sm mb-1 truncate cursor-pointer text-gray-400 hover:underline"
              onClick={() => openInExplorer(path)}
            >
              {idx + 1}. <span className="font-mono">{path}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
