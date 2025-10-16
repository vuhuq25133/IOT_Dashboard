interface Props {
  isConnected: boolean;
  sensorData: { temp: number; humid: number; light: number } | null;
}

const SensorCards = ({ isConnected, sensorData }: Props) => {
  return (
    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-md">
      <h3 className="font-semibold mb-4">Chỉ số hiện tại</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-red-400">
            {isConnected && sensorData ? sensorData.temp.toFixed(1) : "--"}
          </div>
          <p className="text-xs text-gray-400">°C</p>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">
            {isConnected && sensorData ? sensorData.humid.toFixed(1) : "--"}
          </div>
          <p className="text-xs text-gray-400">%</p>
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-400">
            {isConnected && sensorData ? sensorData.light.toFixed(1) : "--"}
          </div>
          <p className="text-xs text-gray-400">Lux</p>
        </div>
      </div>
    </div>
  );
};

export default SensorCards;
