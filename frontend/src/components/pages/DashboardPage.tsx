import { useState, useEffect } from "react";
import io from "socket.io-client";
import SensorChart from "@/components/layout/dashboard/SensorChart";
import SensorCards from "@/components/layout/dashboard/SensorCards";
import DeviceControls from "@/components/layout/dashboard/DeviceControls";
import ConnectionStatus from "@/components/layout/dashboard/ConnectionStatus";

const socket = io("http://localhost:5000"); // Socket.IO backend

const DashboardPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [sensorData, setSensorData] = useState<{ temp: number; humid: number; light: number } | null>(null);
  const [devices, setDevices] = useState<{ fan: "on" | "off" | null; air: "on" | "off" | null; lamp: "on" | "off" | null }>({
    fan: null,
    air: null,
    lamp: null,
  });

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    // Khi có dữ liệu cảm biến mới
    socket.on("sensors:new", (data) => {
      setSensorData({ temp: data.temp, humid: data.humid, light: data.light });
    });

    // Khi có phản hồi trạng thái thiết bị
    socket.on("devices:update", ({ device, state }) => {
      setDevices((prev) => ({ ...prev, [device]: state }));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("sensors:new");
      socket.off("devices:update");
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-gray-100 h-[calc(100vh-6rem)] overflow-hidden">
      {/* Cột biểu đồ */}
      <div className="flex-1 min-h-0">
        <SensorChart isConnected={isConnected} sensorData={sensorData} />
      </div>

      {/* Cột phải */}
      <div className="w-full lg:w-[340px] flex flex-col gap-6 shrink-0">
        <ConnectionStatus isConnected={isConnected} />
        <SensorCards isConnected={isConnected} sensorData={sensorData} />
        <DeviceControls isConnected={isConnected} devices={devices} socket={socket} />
      </div>
    </div>
  );
};

export default DashboardPage;
