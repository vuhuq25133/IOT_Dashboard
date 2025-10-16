import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface Props {
  isConnected: boolean;
  sensorData: { temp: number; humid: number; light: number } | null;
}

const SensorChart = ({ isConnected, sensorData }: Props) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          { label: "Nhiệt độ (°C)", data: [], borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.1)", tension: 0.4 },
          { label: "Độ ẩm (%)", data: [], borderColor: "#3b82f6", backgroundColor: "rgba(59,130,246,0.1)", tension: 0.4 },
          { label: "Ánh sáng (Lux)", data: [], borderColor: "#facc15", backgroundColor: "rgba(250,204,21,0.1)", tension: 0.4 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#9ca3af" } } },
        scales: {
          x: { ticks: { color: "#9ca3af" } },
          y: { ticks: { color: "#9ca3af" } },
        },
      },
    });
  }, []);

  useEffect(() => {
    const chart = chartInstance.current;
    if (!chart || !sensorData || !isConnected) return;
    const now = new Date().toLocaleTimeString();

    chart.data.labels!.push(now);
    chart.data.datasets[0].data.push(sensorData.temp);
    chart.data.datasets[1].data.push(sensorData.humid);
    chart.data.datasets[2].data.push(sensorData.light);

    if (chart.data.labels!.length > 15) {
      chart.data.labels!.shift();
      chart.data.datasets.forEach((d) => (d.data as number[]).shift());
    }
    chart.update();
  }, [sensorData, isConnected]);

  return (
    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-md flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4">Biểu đồ cảm biến</h2>
      {isConnected ? (
        <canvas ref={chartRef} className="w-full h-full" />
      ) : (
        <div className="flex items-center justify-center flex-1 text-gray-500">
          Mất kết nối – dữ liệu tạm dừng
        </div>
      )}
    </div>
  );
};

export default SensorChart;
