import React, { useState } from "react";
import { AiFillPicture } from "react-icons/ai";

export default function Dropzone({ setFiles }: { setFiles: (files: File[]) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("video/")
    );

    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
      setFileName(droppedFiles[0].name); // show the first file name
    }
  };

  return (
    <div
      id="dropzone"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-white border-2 border-dashed w-[70vw] h-[40vh] rounded-3xl shadow-2xl flex flex-col justify-center items-center text-3xl font-semibold transition-colors duration-200 ${
        isDragging ? "bg-slate-500 backdrop-blur-xl text-white" : "bg-nqb text-white"
      }`}
    >
      {fileName ? (
        <span className="text-lg">{fileName}</span>
      ) : isDragging ? (
        <span>Release to upload your video</span>
      ) : (
        <>
          <AiFillPicture className="text-6xl mb-4" />
          Drag Video File Here
        </>
      )}
    </div>
  );
}
