
import './App.css'
import TopBar from './assets/TopBar'
import { AiFillPicture } from "react-icons/ai";


function App() {

  return (
    <>
      <TopBar/>
      
      <div className='w-screen h-screen bg-gradient-to-b from-darple to-blurple flex justify-center p-10'>
        <div id="dropzone" className='border-white border-2 border-dashed w-[70vw] h-[40vh] bg-nqb rounded-3xl shadow-2xl flex flex-col justify-center items-center text-white text-3xl font-semibold'>
          <AiFillPicture className='text-9xl'/>
          Drag Files Here
        </div>
      </div>
    </>
  )
}

export default App
