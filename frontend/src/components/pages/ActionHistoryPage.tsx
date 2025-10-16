import React, { useCallback, useEffect, useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";

interface ActionItem {
  _id: string;
  device: string;
  newState: string;
  timestamp?: string;
  createdAt?: string;
}

const ActionHistoryPage: React.FC = () => {
  const [data, setData] = useState<ActionItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("timestamp");
  const [typeSort, setTypeSort] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);

  const formatDateTime = (timestamp?: string) => {
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        keyword: searchTerm,
        searchBy: "all",
        sortBy,
        typeSort,
        device: deviceFilter,
        state: stateFilter,
      });
      const res = await fetch(
        `http://localhost:5000/api/main/action-history?${query}`
      );
      const json = await res.json();
      setData(json.actions || []);
      setTotalPages(json.totalPages || 1);
    } catch (e) {
      console.error("⚠️ Fetch action history error:", e);
      setData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, sortBy, typeSort, deviceFilter, stateFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReload = () => {
    setSearchTerm("");
    setPage(1);
    setDeviceFilter("all");
    setStateFilter("all");
    fetchData();
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setTypeSort((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setTypeSort("asc");
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return "";
    return typeSort === "asc" ? "▲" : "▼";
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 flex flex-col items-center py-10 px-4 text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Action History</h1>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="Nhập ngày/giờ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-blue-400 bg-gray-800 text-gray-100 rounded-md px-3 py-2 w-72 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <select
          value={deviceFilter}
          onChange={(e) => {
            setDeviceFilter(e.target.value);
            setPage(1);
          }}
          className="border border-blue-400 bg-gray-800 text-gray-100 rounded-md px-3 py-2"
        >
          <option value="all">Thiết bị</option>
          <option value="lamp">Đèn</option>
          <option value="fan">Quạt</option>
          <option value="air">Điều hòa</option>
        </select>
        <select
          value={stateFilter}
          onChange={(e) => {
            setStateFilter(e.target.value);
            setPage(1);
          }}
          className="border border-blue-400 bg-gray-800 text-gray-100 rounded-md px-3 py-2"
        >
          <option value="all">Trạng thái</option>
          <option value="on">ON</option>
          <option value="off">OFF</option>
        </select>
        <button
          onClick={handleReload}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-md shadow-md flex items-center gap-2"
        >
          <FiRefreshCcw /> Reload
        </button>
      </div>

      {/* Table */}
      <div className="w-full max-w-6xl bg-gray-800 shadow-md rounded-lg border border-gray-700">
        <div className="flex justify-end items-center p-3 border-b border-gray-700">
          <label className="text-gray-300 mr-2">Rows per page:</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border border-blue-400 bg-gray-800 text-gray-100 rounded-md px-2 py-1"
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 border border-gray-700">STT</th>
                <th
                  className="p-3 border border-gray-700 cursor-pointer"
                  onClick={() => handleSort("device")}
                >
                  Thiết bị {renderSortIcon("device")}
                </th>
                <th
                  className="p-3 border border-gray-700 cursor-pointer"
                  onClick={() => handleSort("newState")}
                >
                  Trạng thái {renderSortIcon("newState")}
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
                  <td colSpan={4} className="text-center py-4 text-gray-400">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-400">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                data.map((item, i) => (
                  <tr
                    key={item._id}
                    className="text-center border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    <td className="p-2">{(page - 1) * limit + i + 1}</td>
                    <td className="p-2">
                      {item.device === "fan"
                        ? "Quạt"
                        : item.device === "air"
                        ? "Điều hòa"
                        : item.device === "lamp"
                        ? "Đèn"
                        : item.device}
                    </td>

                    <td className="p-2 uppercase">{item.newState}</td>
                    <td className="p-2">
                      {formatDateTime(item.timestamp || item.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-600"
          >
            Prev
          </button>
          <span className="text-gray-300">
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
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

export default ActionHistoryPage;
