import './App.css'
import Dropzone from './assets/Dropzone';
import TopBar from './assets/TopBar'
import Input from './assets/input';
import Start from './assets/Start';

function App() {

  return (
    <>
      <TopBar/>
      
      <div className='w-screen h-screen bg-gradient-to-b from-darple to-blurple flex flex-col items-center p-10'>
        <Dropzone />
        <div className='flex gap-5 items-center text-white text-center mt-10'>
          <Input />
          <Start />
        </div>
      </div>
    </>
  )
}

export default App
