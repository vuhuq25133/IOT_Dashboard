import { useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  isConnected: boolean;
  devices: { fan: "on" | "off" | null; air: "on" | "off" | null; lamp: "on" | "off" | null };
  socket: Socket;
}

const DeviceControls = ({ isConnected, devices, socket }: Props) => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const toggleDevice = (device: "fan" | "air" | "lamp") => {
    if (!isConnected || loading[device]) return;
    const nextState = devices[device] === "on" ? "off" : "on";
    setLoading((prev) => ({ ...prev, [device]: true }));

    socket.emit("device:toggle", { device, state: nextState });
    setTimeout(() => setLoading((prev) => ({ ...prev, [device]: false })), 5000);
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
            { key: "fan", label: "Quạt" },
            { key: "air", label: "Điều hòa" },
            { key: "lamp", label: "Đèn" },
          ].map(({ key, label }) => (
            <tr key={key} className="border-t border-gray-800">
              <td className="py-2">{label}</td>
              <td className="py-2 text-right">
                <button
                  onClick={() => toggleDevice(key as "fan" | "air" | "lamp")}
                  disabled={!isConnected || loading[key]}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition
                    ${devices[key as "fan" | "air" | "lamp"] === "on"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300"}
                    ${(!isConnected || loading[key]) ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading[key] ? "..." : devices[key as "fan" | "air" | "lamp"] ?? "--"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeviceControls;
