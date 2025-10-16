import express from "express";

import changeFan from "../controllers/changeFan.controller.js";
import changeAir from "../controllers/changeAir.controller.js";
import changeLamp from "../controllers/changeLamp.controller.js";
import { getLatestSensors } from "../controllers/latestSensors.controller.js";
import { getActionHistory } from "../controllers/getActionHistory.controller.js";
import { getAllSenSors } from "../controllers/getAllSensors.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Sensor
 *     description: API truy vấn dữ liệu cảm biến (DHT11 + BH1750)
 *   - name: Device
 *     description: API điều khiển và theo dõi thiết bị (Quạt, Điều hòa, Đèn)
 *   - name: ActionHistory
 *     description: API xem lịch sử hành động điều khiển thiết bị
 */

/**
 * @swagger
 * /api/main:
 *   get:
 *     summary: Kiểm tra tình trạng API backend IoT
 *     tags: [Sensor]
 *     responses:
 *       200:
 *         description: Trả về danh sách route hiện có.
 */
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    base: "/api/main",
    routes: [
      { method: "GET", path: "/latest-sensors" },
      { method: "GET", path: "/sensors" },
      { method: "GET", path: "/action-history" },
      { method: "POST", path: "/fan/status" },
      { method: "POST", path: "/air/status" },
      { method: "POST", path: "/lamp/status" },
    ],
  });
});


// ============================================================
// 🔹 SENSOR DATA
// ============================================================

/**
 * @swagger
 * /api/main/latest-sensors:
 *   get:
 *     summary: Lấy 10 bản ghi cảm biến mới nhất
 *     tags: [Sensor]
 *     responses:
 *       200:
 *         description: Danh sách 10 bản ghi cảm biến gần nhất
 *         content:
 *           application/json:
 *             example:
 *               - temperature: 27.4
 *                 humidity: 63.2
 *                 light: 45
 *                 timestamp: "2025-10-16T10:20:00Z"
 */
router.get("/latest-sensors", getLatestSensors);

/**
 * @swagger
 * /api/main/sensors:
 *   get:
 *     summary: Lấy toàn bộ dữ liệu cảm biến (phân trang, tìm kiếm, sắp xếp)
 *     tags: [Sensor]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *         description: Số bản ghi mỗi trang
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: ["asc", "desc"], default: "desc" }
 *         description: Thứ tự sắp xếp theo thời gian
 *     responses:
 *       200:
 *         description: Danh sách dữ liệu cảm biến theo phân trang
 */
router.get("/sensors", getAllSenSors);


// ============================================================
// 🔹 DEVICE CONTROL
// ============================================================

/**
 * @swagger
 * /api/main/fan/status:
 *   post:
 *     summary: Điều khiển quạt (BẬT / TẮT)
 *     tags: [Device]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - state
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [on, off]
 *                 description: Trạng thái muốn thay đổi
 *           example:
 *             state: "on"
 *     responses:
 *       200:
 *         description: Đã gửi lệnh điều khiển thành công
 *         content:
 *           application/json:
 *             example:
 *               fanState: "on"
 */
router.post("/fan/status", changeFan);

/**
 * @swagger
 * /api/main/air/status:
 *   post:
 *     summary: Điều khiển điều hòa (BẬT / TẮT)
 *     tags: [Device]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - state
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [on, off]
 *                 description: Trạng thái muốn thay đổi
 *           example:
 *             state: "off"
 *     responses:
 *       200:
 *         description: Đã gửi lệnh điều khiển thành công
 *         content:
 *           application/json:
 *             example:
 *               airState: "off"
 */
router.post("/air/status", changeAir);

/**
 * @swagger
 * /api/main/lamp/status:
 *   post:
 *     summary: Điều khiển đèn (BẬT / TẮT)
 *     tags: [Device]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - state
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [on, off]
 *                 description: Trạng thái muốn thay đổi
 *           example:
 *             state: "on"
 *     responses:
 *       200:
 *         description: Đã gửi lệnh điều khiển thành công
 *         content:
 *           application/json:
 *             example:
 *               lampState: "on"
 */
router.post("/lamp/status", changeLamp);


// ============================================================
// 🔹 ACTION HISTORY
// ============================================================

/**
 * @swagger
 * /api/main/action-history:
 *   get:
 *     summary: Lấy lịch sử hành động điều khiển thiết bị
 *     tags: [ActionHistory]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Số bản ghi mỗi trang
 *       - in: query
 *         name: device
 *         schema: { type: string, enum: [fan, air, lamp] }
 *         description: Lọc theo loại thiết bị
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *         description: Ngày bắt đầu (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *         description: Ngày kết thúc (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Danh sách lịch sử điều khiển
 *         content:
 *           application/json:
 *             example:
 *               - device: "fan"
 *                 action: "turn_on"
 *                 newState: "on"
 *                 status: "success"
 *                 timestamp: "2025-10-16T10:25:00Z"
 */
router.get("/action-history", getActionHistory);

export default router;
