import './App.css'
import Dropzone from './assets/Dropzone';
import TopBar from './assets/TopBar'
import Input from './assets/Input';
import Start from './assets/Start';
import { useState } from 'react';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [targetSize, setTargetSize] = useState(8);

  return (
    <>
      <TopBar/>
      
      <div className='w-screen h-screen bg-gradient-to-b from-darple to-blurple flex flex-col items-center p-10'>
        <Dropzone setFiles={setFiles} />
        <div className='flex gap-5 items-center text-white text-center mt-10'>
          <Input mb={targetSize} setMb={setTargetSize} />
          <Start files={files} targetSize={targetSize} />

          <div className='bg-nqb rounded-xl p-3 shadow-2xl font-semibold w-25'></div>
        </div>
      </div>
    </>
  )
}

export default App
