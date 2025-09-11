import { useEffect } from "react";

export default function Start({
  files,
  targetSize,
  onProgress,
  onDone,
}: {
  files: File[];
  targetSize: number;
  onProgress: (progress: number) => void;
  onDone: () => void;
}) {
  useEffect(() => {
    const handleProgress = (_event: any, progress: number) => {
      onProgress(progress);
    };

    const handleDone = () => {
      onDone();
    };

    window.ipcRenderer.on("compression-progress", handleProgress);
    window.ipcRenderer.on("compression-done", handleDone);

    return () => {
      window.ipcRenderer.off("compression-progress", handleProgress);
      window.ipcRenderer.off("compression-done", handleDone);
    };
  }, [onProgress, onDone]);

  const handleClick = () => {
    if (!files.length) {
      alert("Please drop a file first!");
      return;
    }

    // reset progress bar before starting
    onProgress(0);

    files.forEach((file) => {
      window.ipcRenderer.send("compress-video", file.path, targetSize);
    });
  };

  return (
    <button
      id="start"
      onClick={handleClick}
      className="bg-nqb rounded-xl p-3 shadow-2xl font-semibold w-25 hover:bg-nqb/80 cursor-pointer"
    >
      Start
    </button>
  );
}
