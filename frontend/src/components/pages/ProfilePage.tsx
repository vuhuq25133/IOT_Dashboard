import { Code2 } from "lucide-react";

const ProfilePage = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-8 text-gray-100">
      {/* LEFT: Profile Info */}
      <div className="flex-1 bg-gray-900/70 border border-gray-800 rounded-2xl p-8 shadow-lg flex flex-col items-center justify-center">
        <div className="w-50 h-50 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-3xl font-bold">
          VH
        </div>

        <h2 className="text-2xl font-semibold mt-4">Vũ Mạnh Hùng</h2>
        <br />
        <p className="text-gray-400 mt-1">MSSV: B22DCCN372</p>
        <p className="text-gray-400">Lớp: D22HTTT06</p>
      </div>

      {/* RIGHT: Introduction + Skills */}
      <div className="flex-[1.3] flex flex-col gap-6">
        {/* Intro */}
        <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Giới thiệu</h3>
          <p className="text-gray-400 leading-relaxed">
            Tôi không ngừng tìm kiếm cơ hội để học hỏi và phát triển, đặc biệt trong các lĩnh vực công nghệ tiên tiến như IoT và ứng dụng web nhúng.
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <a
              href="https://github.com/VUHUQ2513/IOT_Dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 transition"
            >
              GitHub
            </a>
            <a
              href="http://localhost:5000/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-700 hover:bg-gray-600 transition"
            >
              API Docs
            </a>
            <a
              href="https://example.com/report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Báo cáo
            </a>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-3">Công nghệ</h3>

          <div className="space-y-3 text-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 size={18} className="text-orange-400" />
                <span>ESP8266 – IoT Firmware</span>
              </div>
              <span className="text-sm text-gray-500">⚙️</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 size={18} className="text-green-400" />
                <span>Node.js – Express & MQTT Server</span>
              </div>
              <span className="text-sm text-gray-500">🌐</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 size={18} className="text-yellow-400" />
                <span>MongoDB – NoSQL Database</span>
              </div>
              <span className="text-sm text-gray-500">💾</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 size={18} className="text-cyan-400" />
                <span>React (Vite + Tailwind + Shadcn/UI)</span>
              </div>
              <span className="text-sm text-gray-500">🧩</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 size={18} className="text-purple-400" />
                <span>DHT11 & BH1750 – Sensor Integration</span>
              </div>
              <span className="text-sm text-gray-500">📡</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
