import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/SideBar.tsx";
import Header from "@/components/layout/Header.tsx";
import { useEffect, useState } from "react";

export default function MainLayout() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900/80 border-r border-gray-800 backdrop-blur-xl p-4 flex flex-col justify-between">
        <Sidebar />
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md px-6 flex items-center justify-between">
          <Header />
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-gray-900 overflow-y-auto p-6">
          <Outlet />
        </main>
        {/* Time (bottom right) */}
        <div className="text-xs text-gray-400 mt-auto text-right pr-1">
          {time.toLocaleTimeString("vi-VN")}
        </div>
      </div>
    </div>
  );
}
