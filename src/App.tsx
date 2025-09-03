
import './App.css'
import TopBar from './assets/TopBar'

function App() {

  return (
    <>
      <div className='absolute top-0 left-0 w-screen'>
        <TopBar/>
      </div>
      
      <div className='text-3xl font-bold underline'>
        Hello
      </div>
    </>
  )
}

export default App
