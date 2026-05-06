import { Bell } from 'lucide-react';

export default function TopBar({ title, subtitle }) {
  return (
    <header className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-5">
        <button className="relative p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-yellow-500 rounded-full border-2 border-white" />
        </button>
        <div className="w-10 h-10 bg-[#B91C1C] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
          AL
        </div>
      </div>
    </header>
  );
}
