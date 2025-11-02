export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        MyApp
      </div>

      <nav className="flex-1 p-4 space-y-3">
        <a href="/dashboard" className="block p-2 rounded hover:bg-gray-800">
          Dashboard
        </a>
        <a href="#" className="block p-2 rounded hover:bg-gray-800">
          Profile
        </a>
        <a href="#" className="block p-2 rounded hover:bg-gray-800">
          Settings
        </a>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button className="w-full bg-red-600 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      </div>
    </div>
  );
}
