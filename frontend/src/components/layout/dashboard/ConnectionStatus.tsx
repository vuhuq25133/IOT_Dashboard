import { useEffect, useState } from "react";

interface Props {
  isConnected: boolean;
}

const ConnectionStatus: React.FC<Props> = ({ isConnected }) => {
  const [localConnected, setLocalConnected] = useState(isConnected);

  useEffect(() => {
    setLocalConnected(isConnected);
  }, [isConnected]);

  return (
    <div className="flex items-center gap-2 text-sm text-white">
      <div
        className={`w-3 h-3 rounded-full ${
          localConnected ? "bg-green-400" : "bg-red-500"
        }`}
      ></div>
      <span>{localConnected ? "Connected" : "Disconnected"}</span>
    </div>
  );
};

export default ConnectionStatus;