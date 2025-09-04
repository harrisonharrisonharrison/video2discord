import React from 'react'

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
        className="rounded-t-xl bg-darple w-screen h-7"
        style={{ WebkitAppRegion: 'drag' }}
      ></div>
      <div id="control-buttons" className="text-stone-200 absolute top-0 right-0 pe-2" style={{ WebkitAppRegion: 'no-drag' }}>
        <button id="min-button" className='p-1' onClick={handleMinimize}>&#95;</button>
        <button id="close-button" className='p-1' onClick={handleClose}>&#128473;</button>
      </div>
    </div>
  )
}