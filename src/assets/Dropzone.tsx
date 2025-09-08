import React from "react"
import { AiFillPicture } from "react-icons/ai";

export default function Dropzone({ setFiles }: { setFiles: (files: File[]) => void }) {
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files).filter(
      (file) => file.type.startsWith("video/") // only videos
    );
    setFiles(droppedFiles);
  };

  return (
    <div
      id="dropzone"
      className="border-white border-2 border-dashed w-[70vw] h-[40vh] bg-nqb rounded-3xl shadow-2xl flex flex-col justify-center items-center text-white text-3xl font-semibold"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <AiFillPicture className="text-6xl mb-4" />
      Drag Video Files Here
    </div>
  );
}

