
import './App.css'
import Dropzone from './assets/Dropzone';
import TopBar from './assets/TopBar'
import { AiFillPicture } from "react-icons/ai";


function App() {

  return (
    <>
      <TopBar/>
      
      <div className='w-screen h-screen bg-gradient-to-b from-darple to-blurple flex justify-center p-10'>
        <Dropzone />
      </div>
    </>
  )
}

export default App
