interface InputProps {
  mb: number;
  setMb: (value: number) => void;
}

export default function Input({ mb, setMb }: InputProps) {
  return (
    <div className="bg-nqb rounded-xl p-3 shadow-2xl font-semibold w-25 flex items-center gap-2">
      <input
        type="number"
        min={8}
        max={100}
        value={mb}
        onChange={(e) => setMb(Number(e.target.value))}
        className="w-16 rounded text-white"
      />
      MB
    </div>
  );
}
