import React, { useEffect, useState, useCallback } from "react";
import { FiRefreshCcw } from "react-icons/fi";

// Feature flag: enable local substring filtering (disabled by default)
const ENABLE_CLIENT_FILTER = false;

interface SensorData {
  _id: string;
  temperature: number;
  humidity: number;
  light: number;
  timestamp?: string;
  createdAt?: string;
  updatedAt?: string;
  deviceId?: string;
}

const DataSensorPage: React.FC = () => {
  const [data, setData] = useState<SensorData[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [sortBy, setSortBy] = useState("timestamp");
  const [typeSort, setTypeSort] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);

  // === Fetch data ===
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        keyword: searchTerm,
        searchBy,
        sortBy,
        typeSort,
      });
      const res = await fetch(`http://localhost:5000/api/main/sensors?${query}`);
      const result = await res.json();
      let results: SensorData[] = result.results || [];

      // --- Lọc tại client theo chuỗi tồn tại ---
      if (ENABLE_CLIENT_FILTER && searchTerm && ["all", "date"].includes(searchBy)) {
        const lowerKeyword = searchTerm.toLowerCase();
        results = results.filter((item) => {
          const formattedTime = formatVNDateTime(item.timestamp).toLowerCase();
          return (
            formattedTime.includes(lowerKeyword) ||
            item.temperature.toString().includes(lowerKeyword) ||
            item.humidity.toString().includes(lowerKeyword) ||
            item.light.toString().includes(lowerKeyword)
          );
        });
      }

      setData(results);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Fetch error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, searchBy, sortBy, typeSort]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // === Format date to hh:mm:ss dd/mm/yyyy ===
  const formatVNDateTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const d = new Date(timestamp);
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    const s = String(d.getSeconds()).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}/${month}/${day} ${h}:${m}:${s}`;
  };

  // === Placeholder logic ===
  const getPlaceholder = () => {
    return "Nhập từ khóa...";
  };

  // === Reload ===
  const handleReload = () => {
    setSearchTerm("");
    setPage(1);
    fetchData();
  };

  // === Sort toggle ===
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setTypeSort(typeSort === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setTypeSort("asc");
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return "⇅";
    return typeSort === "asc" ? "▲" : "▼";
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 flex flex-col items-center py-10 px-4 text-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-100">Data Sensors</h1>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder={getPlaceholder()}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-blue-400 bg-gray-800 text-gray-100 rounded-md px-3 py-2 w-72 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="border border-blue-400 bg-gray-800 text-gray-100 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="all">Tất cả</option>
          <option value="temperature">Nhiệt độ</option>
          <option value="humidity">Độ ẩm</option>
          <option value="light">Ánh sáng</option>
          <option value="date">Thời gian</option>
        </select>
        <button
          onClick={handleReload}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-md shadow-md flex items-center gap-2"
        >
          <FiRefreshCcw className="text-lg" /> Reload
        </button>
      </div>

      {/* Table Container */}
      <div className="w-full max-w-6xl bg-gray-800 shadow-md rounded-lg border border-gray-700">
        {/* Rows per page on top-right */}
        <div className="flex justify-end items-center p-3 border-b border-gray-700">
          <label className="text-gray-300 font-medium mr-2">
            Rows per page:
          </label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border border-blue-400 bg-gray-800 text-gray-100 rounded-md px-2 py-1"
          >
            {[5, 10, 15, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 border border-gray-700">STT</th>
                <th
                  className="p-3 border border-gray-700 cursor-pointer"
                  onClick={() => handleSort("temperature")}
                >
                  Nhiệt độ (°C) {renderSortIcon("temperature")}
                </th>
                <th
                  className="p-3 border border-gray-700 cursor-pointer"
                  onClick={() => handleSort("humidity")}
                >
                  Độ ẩm (%) {renderSortIcon("humidity")}
                </th>
                <th
                  className="p-3 border border-gray-700 cursor-pointer"
                  onClick={() => handleSort("light")}
                >
                  Ánh sáng (Lux) {renderSortIcon("light")}
                </th>
                <th
                  className="p-3 border border-gray-700 cursor-pointer"
                  onClick={() => handleSort("timestamp")}
                >
                  Thời gian {renderSortIcon("timestamp")}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                data.map((sensor, index) => (
                  <tr
                    key={sensor._id}
                    className={`text-center border-b border-gray-700 hover:bg-gray-700 transition ${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                    }`}
                  >
                    <td className="p-2">{(page - 1) * limit + index + 1}</td>
                    <td className="p-2">{sensor.temperature}</td>
                    <td className="p-2">{sensor.humidity}</td>
                    <td className="p-2">{sensor.light}</td>
                    <td className="p-2">{formatVNDateTime(sensor.timestamp)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination below table */}
        <div className="flex justify-center items-center py-4 border-t border-gray-700 space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(1)}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-600"
          >
            First
          </button>
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-600"
          >
            Prev
          </button>
          <span className="text-gray-300">
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-600"
          >
            Next
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-600"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSensorPage;
