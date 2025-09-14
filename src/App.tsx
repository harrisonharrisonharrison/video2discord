import './App.css'
import Dropzone from './assets/Dropzone';
import TopBar from './assets/TopBar'
import Input from './assets/Input';
import Start from './assets/Start';
import Progress from './assets/Progress';
import SavedVideos from './assets/SavedVideos';
import { useState } from 'react';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [targetSize, setTargetSize] = useState(8);

  return (
    <>
      <TopBar/>
      
      <div className='w-screen h-screen bg-gradient-to-b from-darple to-blurple flex flex-col items-center'>
        <div className="flex flex-col items-center bg-nqb/50 w-[90vw] h-[90vh] rounded-3xl shadow-2xl p-10">
          <Dropzone setFiles={setFiles} />
          <div className='flex gap-3 w-[70vw] items-center justify-center text-white text-center mt-5'>
            <Input mb={targetSize} setMb={setTargetSize} />
            <Start files={files} targetSize={targetSize} />
            <Progress />
          </div>
          <div className='mt-5 w-[70vw] gap-5 flex'>
            <SavedVideos />
            <div className='border-1 h-[30vh]'>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App