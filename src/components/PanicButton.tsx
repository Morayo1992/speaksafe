import { AlertCircle } from 'lucide-react';

export default function PanicButton() {
  const handlePanic = () => {
    window.location.href = 'https://google.com';
  };

  return (
    <button
      onClick={handlePanic}
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-2 transition transform hover:scale-105"
    >
      <AlertCircle className="w-4 h-4" />
      <span className="text-sm">Exit</span>
    </button>
  );
}
