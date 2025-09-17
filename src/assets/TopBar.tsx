import icon from '../icon.png'

export default function TopBar() {
    const handleMinimize = () => {
        window.ipcRenderer.send('minimize-window')
    }
    const handleClose = () => {
        window.ipcRenderer.send('close-window')
    }
  return (
    <div>
      <div
        className="rounded-t-xl bg-darple w-screen h-7 text-white indent-10"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        <img src={icon} className="h-5 w-5 absolute top-1 left-3  pointer-events-none" />
        <h1 className='absolute top-1 text-sm text-gray-400  pointer-events-none'>video2discord</h1>
      </div>
              
      <div className='flex flex-row w-screen'>
        
      </div>

      <div id="control-buttons" className="text-stone-200 absolute top-0 right-0 pe-2" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
        <button id="min-button" className='p-1' onClick={handleMinimize}>&#95;</button>
        <button id="close-button" className='p-1' onClick={handleClose}>&#128473;</button>
      </div>
    </div>
  )
}