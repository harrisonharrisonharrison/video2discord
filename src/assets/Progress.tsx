import { useEffect, useState } from "react";

export default function Progress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleDuration = (_event: any, data: any) => {
      if (data?.duration) {
        console.log("Video duration:", data.duration);
      }
    };

    const handleProgress = (_event: any, data: any) => {
      if (typeof data?.progress === "number") {
        setProgress(Math.min(data.progress, 100));
      }
    };

    window.ipcRenderer.on("compression-duration", handleDuration);
    window.ipcRenderer.on("compression-progress", handleProgress);

    return () => {
      window.ipcRenderer?.removeAllListeners?.("compression-duration");
      window.ipcRenderer?.removeAllListeners?.("compression-progress");
    };
  }, []);

  return (
    <div className="w-64 h-4 bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-green-500 transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
