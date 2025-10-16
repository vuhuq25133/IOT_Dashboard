import { NavLink } from "react-router-dom";
import { Home, Activity, History, User } from "lucide-react";

export default function Sidebar() {
  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/sensors", label: "Data Sensor", icon: <Activity size={20} /> },
    { path: "/history", label: "Action History", icon: <History size={20} /> },
    { path: "/profile", label: "Profile", icon: <User size={20} /> },
  ];

  return (
    <div className="flex flex-col h-full p-4">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-8">
        <img
          src="/profile.jpg"
          alt="User Profile"
          className="w-12 h-12 rounded-full border-2 border-gray-800 object-cover"
        />
        <div>
          <p className="font-semibold text-white">Vũ Mạnh Hùng</p>
          <p className="text-xs text-gray-400">IoT Engineer</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {icon}
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
