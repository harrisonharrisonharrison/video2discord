import "./App.css";
import Dropzone from "./assets/Dropzone";
import TopBar from "./assets/TopBar";
import Input from "./assets/Input";
import Start from "./assets/Start";
import Progress from "./assets/Progress";
import { useState, useEffect } from "react";

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [targetSize, setTargetSize] = useState(8);
  const [completed, setCompleted] = useState(0);

  const handleProgress = (done: number) => {
    setCompleted(done);
  };

  useEffect(() => {
    const handleDone = () => {
      // remove the first file from the list after completion
      setFiles((prevFiles) => prevFiles.slice(1));
      setCompleted(0); // reset progress bar to 0
    };

    window.ipcRenderer.on("compression-done", handleDone);

    return () => {
      window.ipcRenderer.off("compression-done", handleDone);
    };
  }, []);

  return (
    <>
      <TopBar />

      <div className="w-screen h-screen bg-gradient-to-b from-darple to-blurple flex flex-col items-center">
        <div className="flex flex-col items-center bg-nqb/50 w-[90vw] h-[90vh] rounded-3xl shadow-2xl p-10">
          <Dropzone setFiles={setFiles} />

          <div className="flex gap-3 w-[70vw] items-center text-white text-center mt-5">
            <Input mb={targetSize} setMb={setTargetSize} />
            <Start
              files={files}
              targetSize={targetSize}
              onProgress={handleProgress}
            />
            <Progress completed={completed} total={1} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
