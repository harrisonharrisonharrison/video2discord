import { useState } from "react";

export default function Input() {
  const [mb, setMb] = useState(8);

  return (
    <div className='bg-nqb rounded-xl p-3 shadow-2xl font-semibold w-25'>
        <input
          type="number"
          min={8}
          max={100}
          value={mb}
          onChange={(e) => setMb(Number(e.target.value))}
          className="w-11"
        />
        MB
    </div>
  );
}
