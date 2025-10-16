interface Props {
  isConnected: boolean;
}

const ConnectionStatus = ({ isConnected }: Props) => {
  return (
    <div
      className={`flex items-center gap-2 text-sm ${
        isConnected ? "text-green-400" : "text-red-400"
      }`}
    >
      <span
        className={`w-3 h-3 rounded-full ${
          isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
        }`}
      ></span>
      {isConnected ? "Đang kết nối thiết bị" : "Mất kết nối thiết bị"}
    </div>
  );
};

export default ConnectionStatus;
