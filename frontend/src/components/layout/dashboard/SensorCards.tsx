import React from "react";

interface Props {
  isConnected: boolean;
  sensorData: {
    temp: number | null;
    humid: number | null;
    light: number | null;
  } | null;
}

const SensorCards: React.FC<Props> = ({ isConnected, sensorData }) => {
  const temperature = isConnected && sensorData?.temp != null ? sensorData.temp.toFixed(1) : "--";
  const humidity  = isConnected && sensorData?.humid != null ? sensorData.humid.toFixed(1) : "--";
  const light     = isConnected && sensorData?.light != null ? sensorData.light.toFixed(1) : "--";

  return (
    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-md">
      <h3 className="font-semibold mb-4">Chỉ số hiện tại</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        {/* Temperature */}
        <div>
          <div className="text-2xl font-bold text-red-400"> {temperature} </div>
          <p className="text-xs text-gray-400">°C</p>
        </div>
        {/* Humidity */}
        <div>
          <div className="text-2xl font-bold text-blue-400"> {humidity} </div>
          <p className="text-xs text-gray-400">%</p>
        </div>
        {/* Light */}
        <div>
          <div className="text-2xl font-bold text-yellow-400"> {light} </div>
          <p className="text-xs text-gray-400">Lux</p>
        </div>
      </div>
    </div>
  );
};

export default SensorCards;
