# 🌐 IoT Dashboard 2025

Dự án **IoT Dashboard** cung cấp hệ thống giám sát và điều khiển thiết bị theo thời gian thực. Hệ thống gồm ba phần chính: **mã nhúng ESP8266**, **máy chủ backend (Node.js + Express + MQTT)**, và **giao diện frontend (React + Tailwind)**.
Dự án được phát triển trong khuôn khổ học phần **Internet of Things – Học viện Công nghệ Bưu chính Viễn thông (PTIT)** dưới sự hướng dẫn của **Thầy Nguyễn Quốc Uy**.

---

## ⚙️ Tổng quan chức năng

* **Giám sát cảm biến:** Thu thập và hiển thị theo thời gian thực các giá trị nhiệt độ (DHT11), độ ẩm và ánh sáng (BH1750).
* **Điều khiển thiết bị:** Bật/tắt **đèn**, **quạt**, **điều hòa** từ giao diện web.
* **Lịch sử điều khiển:** Lưu lại mọi thao tác bật/tắt vào MongoDB và hiển thị tại trang *Action History*.
* **Realtime:** Dữ liệu được cập nhật tức thì thông qua **MQTT** và **Socket.IO**.
* **Swagger Docs:** Tự động sinh tài liệu API tại đường dẫn `/api-docs`.

---

## 📁 Cấu trúc dự án

```
IOT_Dashboard/
│
├── embedded/
│   └── sketch_aug18a.ino        # Mã nhúng ESP8266 đọc DHT11 + BH1750, gửi MQTT
│
├── backend/
│   ├── src/
│   │   ├── controllers/          # Bộ điều khiển API
│   │   ├── models/               # Mongoose models
│   │   ├── routes/               # Định nghĩa route
│   │   ├── mqtt/                 # MQTT client kết nối đến broker
│   │   ├── services/             # Xử lý realtime Socket.IO & MQTT
│   │   └── lib/db.js             # Kết nối MongoDB
│   ├── .env                      # Cấu hình môi trường (MQTT, Mongo URI, PORT)
│   └── index.js                  # Chạy backend
│
├── frontend_iot/
│   ├── src/
│   │   ├── components/layout/    # Header, Sidebar, Layout chính
│   │   ├── components/pages/     # Dashboard, Sensors, History, Profile
│   │   └── App.tsx / main.tsx    # Khởi tạo React Router & cấu hình app
```

---

## 🚀 Hướng dẫn cài đặt

### 1️⃣ Embedded Code (ESP8266)

1. Cài **Arduino IDE** và các thư viện trong thư mục `embedded/lib`.
2. Mở file `sketch_aug18a.ino` → nạp vào board NodeMCU ESP8266.
3. Cấu hình WiFi và MQTT broker trong file:

   ```cpp
   const char* mqtt_broker = "172.20.10.7";
   const char* mqtt_username = "iotuser";
   const char* mqtt_password = "iotpass";
   ```
4. Sau khi upload, ESP8266 sẽ gửi dữ liệu cảm biến mỗi 2s đến topic `sensor/datas`.

---

### 2️⃣ Backend Server

```bash
cd backend
npm i
npm run dev
```

* **Mặc định chạy tại:** `http://localhost:5000`
* **Tài liệu API:** [Here](http://localhost:5000/api-docs)

#### Endpoint chính

| Loại   | Đường dẫn                  | Mô tả                                  |
| ------ | -------------------------- | -------------------------------------- |
| `GET`  | `/api/main/latest-sensors` | Lấy một số bản ghi cảm biến mới nhất    |
| `GET`  | `/api/main/sensors`        | Phân trang & tìm kiếm dữ liệu cảm biến |
| `GET`  | `/api/main/action-history` | Xem lịch sử điều khiển thiết bị         |
| `POST` | `/api/main/fan/status`     | Bật/tắt quạt                           |
| `POST` | `/api/main/air/status`     | Bật/tắt điều hòa                       |
| `POST` | `/api/main/lamp/status`    | Bật/tắt đèn                            |

---

### 3️⃣ Frontend WebApp

```bash
cd frontend_iot
npm i
npm run dev
```

* **Mặc định:** chạy tại [http://localhost:8000](http://localhost:8000)
* Giao diện được chia thành 4 trang chính:

  * 📊 **Dashboard:** Biểu đồ realtime & điều khiển thiết bị.
  * 📈 **Data Sensors:** Bảng dữ liệu cảm biến với phân trang, lọc, sắp xếp.
  * 🕹️ **Action History:** Lịch sử bật/tắt thiết bị.
  * 👤 **Profile:** Thông tin sinh viên và liên kết GitHub / báo cáo.

---

## 🌍 Kết nối Realtime

* ESP8266 ↔ **MQTT Broker (172.20.10.7)** ↔ Backend ↔ Frontend.
* Mọi dữ liệu sensor gửi qua `sensor/datas` được hiển thị ngay lập tức trên Dashboard.
* Hành động điều khiển phát qua Socket.IO → backend → publish MQTT (`iot/fan`, `iot/air`, `iot/lamp`).

---

## 🧠 Công nghệ sử dụng

| Thành phần    | Công nghệ                                  |
| ------------- | ------------------------------------------ |
| Vi điều khiển | ESP8266 NodeMCU                            |
| Cảm biến      | DHT11 (nhiệt độ, độ ẩm), BH1750 (ánh sáng) |
| Giao tiếp     | MQTT (Pub/Sub), Socket.IO                  |
| Backend       | Node.js, Express.js, Mongoose              |
| Database      | MongoDB Atlas                              |
| Frontend      | React + Vite + TailwindCSS + Chart.js      |
| API Docs      | Swagger UI (OpenAPI 3.0)                   |
---

## 👤 Tác giả

**Vũ Mạnh Hùng – B22DCCN372**
Lớp: D22HTTT06 – PTIT
📘 GitHub: [Here](https://github.com/VUHUQ25133/IOT_Dashboard)
