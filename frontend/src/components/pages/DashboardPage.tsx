import { useState, useEffect } from "react";
import io from "socket.io-client";
import SensorChart from "@/components/layout/dashboard/SensorChart";
import SensorCards from "@/components/layout/dashboard/SensorCards";
import DeviceControls from "@/components/layout/dashboard/DeviceControls";
import ConnectionStatus from "@/components/layout/dashboard/ConnectionStatus";

const socket = io("http://localhost:5000");

const DashboardPage = () => {
  const [sensorData, setSensorData] = useState<{
    temp: number | null;
    humid: number | null;
    light: number | null;
  }>({ temp: null, humid: null, light: null });

  const [devices, setDevices] = useState<{
    fan: "on" | "off" | null;
    air: "on" | "off" | null;
    lamp: "on" | "off" | null;
  }>({
    fan: null,
    air: null,
    lamp: null,
  });

  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // 🔹 Lấy trạng thái thiết bị mới nhất khi F5 hoặc load lần đầu
  useEffect(() => {
    const fetchDeviceStates = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/main/devices/state");
        const data = await res.json();
        setDevices({
          fan: data.fan ?? null,
          air: data.air ?? null,
          lamp: data.lamp ?? null,
        });
        console.log("🔄 Loaded device states:", data);
      } catch (error) {
        console.warn("⚠️ Không thể tải trạng thái thiết bị ban đầu:", error);
      }
    };
    fetchDeviceStates();
  }, []);

  // 🔹 Socket realtime cập nhật dữ liệu cảm biến và thiết bị
  useEffect(() => {
    socket.on("sensors:new", (data) => {
      setSensorData({
        temp: data.temp ?? null,
        humid: data.humid ?? null,
        light: data.light ?? null,
      });
      setLastUpdate(Date.now());
    });

    socket.on("devices:update", ({ device, state }) => {
      setDevices((prev) => ({ ...prev, [device]: state }));
    });

    const interval = setInterval(() => {
      const diff = Date.now() - lastUpdate;
      setIsConnected(diff < 5000);
    }, 1000);

    return () => {
      socket.off("sensors:new");
      socket.off("devices:update");
      clearInterval(interval);
    };
  }, [lastUpdate]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-gray-100 h-full overflow-hidden">
      {/* Biểu đồ cảm biến */}
      <div className="flex-1 min-h-0">
        <SensorChart isConnected={isConnected} sensorData={sensorData} />
      </div>

      {/* Cột bên phải */}
      <div className="w-full lg:w-[340px] flex flex-col gap-6 shrink-0">
        <ConnectionStatus isConnected={isConnected} />
        <SensorCards isConnected={isConnected} sensorData={sensorData} />
        <DeviceControls
          isConnected={isConnected}
          devices={devices}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
