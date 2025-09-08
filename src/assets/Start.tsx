export default function Start({ files, targetSize }: { files: File[]; targetSize: number }) {
  const handleClick = () => {
    if (!files.length) {
      alert("Please drop a file first!");
      return;
    }

    files.forEach((file) => {
      window.ipcRenderer.send("compress-video", file.path, targetSize);
    });
  };

  return (
    <button
      id="start"
      onClick={handleClick}
      className="bg-nqb rounded-xl p-3 shadow-2xl font-semibold w-25"
    >
      Start
    </button>
  );
}
