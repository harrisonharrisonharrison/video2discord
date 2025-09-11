export default function Progress({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const percent = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="flex-grow mt-4">
      <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden shadow-inner">
        <div
          className="bg-green-500 h-6 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-white text-center mt-2 font-semibold">
        {completed}/{total}
      </p>
    </div>
  );
}
