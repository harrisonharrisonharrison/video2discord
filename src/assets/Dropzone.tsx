import React, { useEffect } from "react"
import { AiFillPicture } from "react-icons/ai";

export default function Dropzone() {
    useEffect(() => {
        window.ipcRenderer.on("compress-progress", (_, msg) => {
        console.log("progress:", msg)
        })
        window.ipcRenderer.on("compress-done", (_, outputFile) => {
        alert(`Compression finished! Saved to: ${outputFile}`)
        })
    }, [])

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const files = Array.from(e.dataTransfer.files)

        // Filter to videos only
        const videoFiles = files.filter(file => file.type.startsWith("video/"))

        if (videoFiles.length > 0) {
            // Send first video path to main process
            window.ipcRenderer.send("compress-video", videoFiles[0].path)
        }
    }

    return (
    <div
        id="dropzone"
        className="border-white border-2 border-dashed w-[70vw] h-[40vh] bg-nqb rounded-3xl shadow-2xl flex flex-col justify-center items-center text-white text-3xl font-semibold"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()} // allow drop
    >
        <AiFillPicture className='text-9xl'/>
        <p>Drag Files Here</p>
    </div>
    )
}
