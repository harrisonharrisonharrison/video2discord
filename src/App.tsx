
import './App.css'
import TopBar from './assets/TopBar'

function App() {

  return (
    <>
      <TopBar/>
      
      <div className='w-screen h-screen bg-gradient-to-b from-darple to-blurple flex justify-center'>
        <div id="dropzone" className='border-white border-2 border-dashed w-[70vw] h-[40vh] bg-nqb rounded-3xl shadow-2xl flex justify-center items-center text-white text-3xl font-semibold'>
          Drag Files Here
        </div>
      </div>
    </>
  )
}

export default App
