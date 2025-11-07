import { useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  isConnected: boolean;
  devices: {
    fan: "on" | "off" | null;
    air: "on" | "off" | null;
    lamp: "on" | "off" | null;
  };
  socket: Socket;
}

const DeviceControls = ({ isConnected, devices, socket }: Props) => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  // Hàm gửi toggle tới backend qua socket
  const toggleDevice = (device: "fan" | "air" | "lamp") => {
    // Không cho phép nếu thiết bị ngắt kết nối hoặc đang xử lý
    if (!isConnected || loading[device]) return;

    const nextState = devices[device] === "on" ? "off" : "on";

    // Bắt đầu loading
    setLoading((prev) => ({ ...prev, [device]: true }));

    // Gửi yêu cầu toggle tới backend
    socket.emit("device:toggle", { device, state: nextState });

    // Gọi API để lưu hành động
    fetch(`http://localhost:5000/api/main/${device}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: nextState }),
    })
      .then((res) => res.json())
      .then(() => console.log(`📦 Action logged for ${device}: ${nextState}`))
      .catch((err) => console.error("❌ Lỗi khi lưu action:", err));

    // Hết loading sau 5s (nếu không có phản hồi)
    setTimeout(() => {
      setLoading((prev) => ({ ...prev, [device]: false }));
    }, 5000);
  };

  return (
    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-md">
      <h3 className="font-semibold mb-4">Điều khiển thiết bị</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400">
            <th className="text-left font-medium">Thiết bị</th>
            <th className="text-right font-medium">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {[
            { key: "lamp", label: "Đèn" },
            { key: "fan", label: "Quạt" },
            { key: "air", label: "Điều hòa" }
          ].map(({ key, label }) => {
            const state = devices[key as "fan" | "air" | "lamp"];
            const isOn = state === "on";
            const isDisabled = !isConnected || loading[key];

            return (
              <tr key={key} className="border-t border-gray-800">
                <td className="py-2">{label}</td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => toggleDevice(key as "fan" | "air" | "lamp")}
                    disabled={isDisabled}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                      ${
                        isOn
                          ? "bg-blue-600 text-white hover:bg-blue-500"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }
                      ${isDisabled ? "bg-gray-700 opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {loading[key] ? "Loading..." : !isConnected ? "Disconnected" : state ? state === "on" ? "ON" : "OFF" : "--"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DeviceControls;
