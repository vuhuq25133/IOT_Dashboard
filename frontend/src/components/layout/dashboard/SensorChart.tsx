import { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Title,
  Tooltip,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Title,
  Tooltip
);

interface Props {
  isConnected: boolean;
  sensorData: {
    temp: number | null;
    humid: number | null;
    light: number | null;
  } | null;
}

interface SensorRecord {
  temperature: number;
  humidity: number;
  light: number;
  timestamp: string;
}

const SensorChart = ({ sensorData }: Props) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const [visible, setVisible] = useState({ temp: true, humid: true, light: true });

  const [dataHistory, setDataHistory] = useState<
    {
      time: string;
      temp: number | null;
      humid: number | null;
      light: number | null;
    }[]
  >([]);

  // Load 10 bản ghi mới nhất khi khởi tạo
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/main/latest-sensors");
        const data = await res.json();
        const formatted = (data as SensorRecord[]).reverse().map((d) => ({
          time: new Date(d.timestamp).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          temp: d.temperature,
          humid: d.humidity,
          light: d.light,
        }));
        setDataHistory(formatted);
      } catch (e) {
        console.error("❌ Lỗi load dữ liệu ban đầu:", e);
      }
    })();
  }, []);

  // Realtime cập nhật khi có sensorData mới
  useEffect(() => {
    if (!sensorData || sensorData.temp === null) return;
    const now = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setDataHistory((prev) => {
      const updated = [...prev, { time: now, ...sensorData }];
      return updated.slice(-10);
    });
  }, [sensorData]);

  // Khởi tạo chart
  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d")!;
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "🌡️ Nhiệt độ (°C)",
            yAxisID: "y",
            data: [],
            borderColor: "#f87171",
            backgroundColor: "rgba(248,113,113,0.1)",
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 2,
            hidden: !visible.temp,
          },
          {
            label: "💧 Độ ẩm (%)",
            yAxisID: "y",
            data: [],
            borderColor: "#60a5fa",
            backgroundColor: "rgba(96,165,250,0.1)",
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 2,
            hidden: !visible.humid,
          },
          {
            label: "☀️ Ánh sáng (Lux)",
            yAxisID: "z",
            data: [],
            borderColor: "#facc15",
            backgroundColor: "rgba(250,204,21,0.1)",
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 2,
            hidden: !visible.light,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500, easing: "easeOutQuart" },
        layout: {
          padding: {
            bottom: 10, // 👈 chừa khoảng cho nhãn trục X
          },
        },
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            color: "#e5e7eb",
            font: { size: 14 },
          },
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          x: {
            ticks: {
              color: "#9ca3af",
              padding: 8, // 👈 thêm padding cho nhãn trục X
            },
            grid: { color: "#1f2937" },
          },
          y: {
            position: "left",
            ticks: { color: "#9ca3af" },
            grid: { color: "#1f2937" },
            beginAtZero: true,
            min: 0,
            max: 100,
            title: {
              display: true,
              text: "°C / %",
              color: "#9ca3af",
            },
          },
          z: {
            position: "right",
            ticks: { color: "#facc15" },
            grid: { drawOnChartArea: false },
            beginAtZero: true,
            title: {
              display: true,
              text: "Lux",
              color: "#facc15",
            },
          },
        },
      },
    });
    return () => chartInstance.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cập nhật dữ liệu mỗi khi dataHistory thay đổi
  useEffect(() => {
    const chart = chartInstance.current;
    if (!chart) return;
    chart.data.labels = dataHistory.map((d) => d.time);
    chart.data.datasets[0].data = dataHistory.map((d) => d.temp);
    chart.data.datasets[1].data = dataHistory.map((d) => d.humid);
    chart.data.datasets[2].data = dataHistory.map((d) => d.light);
    chart.update("active");
  }, [dataHistory]);

  // Toggle hiển thị cảm biến
  const toggleLine = (key: "temp" | "humid" | "light") => {
    const chart = chartInstance.current;
    if (!chart) return;
    const datasetIndex = key === "temp" ? 0 : key === "humid" ? 1 : 2;
    const dataset = chart.data.datasets[datasetIndex];
    dataset.hidden = !dataset.hidden;
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
    chart.update("active");
  };

  return (
    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-md h-[400px]">
      <h3 className="font-semibold mb-4">Biểu đồ cảm biến</h3>

      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={() => toggleLine("temp")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
            visible.temp
              ? "bg-red-800 text-white hover:bg-red-600"
              : "bg-gray-700 text-gray-400 line-through hover:bg-gray-600"
          }`}
        >
          🌡️ Nhiệt độ
        </button>
        <button
          onClick={() => toggleLine("humid")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
            visible.humid
              ? "bg-blue-800 text-white hover:bg-blue-600"
              : "bg-gray-700 text-gray-400 line-through hover:bg-gray-600"
          }`}
        >
          💧 Độ ẩm
        </button>
        <button
          onClick={() => toggleLine("light")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
            visible.light
              ? "bg-yellow-600 text-black hover:bg-yellow-500"
              : "bg-gray-700 text-gray-400 line-through hover:bg-gray-600"
          }`}
        >
          ☀️ Ánh sáng
        </button>
      </div>

      <div className="h-[300px]">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default SensorChart;
