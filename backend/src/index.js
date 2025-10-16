// ====================== IMPORTS ======================
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { setupSwagger } from "./swagger.js";
import mqttClient from "./mqtt/mqttClient.js";
import Sensor from "./models/sensors.model.js";
import mainRoute from "./routes/main.route.js";
import { connectDB } from "./lib/db.js";
import DeviceState from "./models/deviceState.model.js";
import Action from "./models/actions.model.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// ================= Swagger =================
setupSwagger(app);


// ================= ROUTES =================
app.use("/api/main", mainRoute);

// ================= MQTT HANDLER =================
mqttClient.on("connect", () => {
  console.log("✅ MQTT connected (IoT 2025)");

  const topics = [
    "sensor/datas",
    "iot/fan/status",
    "iot/air/status",
    "iot/lamp/status",
  ];

  topics.forEach((t) =>
    mqttClient.subscribe(t, (err) =>
      err ? console.error(`❌ Failed to subscribe: ${t}`) : console.log(`✅ Subscribed: ${t}`)
    )
  );
});

// Khi nhận MQTT
mqttClient.on("message", async (topic, message) => {
  try {
    const msg = message.toString().trim().toLowerCase();

    // ======= SENSOR DATA =======
    if (topic === "sensor/datas") {
      const data = JSON.parse(msg);
      const { temp, humid, light } = data;
      if ([temp, humid, light].every((v) => typeof v === "number")) {
        const row = await Sensor.create({
          temperature: temp,
          humidity: humid,
          light,
          timestamp: new Date(),
        });

        io.emit("sensors:new", { temp, humid, light, measured_at: row.timestamp });

        const vnTime = new Date(Date.now() + 7 * 3600000)
          .toISOString()
          .replace("T", " ")
          .split(".")[0];
        console.log(`[${vnTime}] ✅ Saved: T=${temp}°C, H=${humid}%, L=${light} lux`);
      }
    }

    // ======= DEVICE STATUS =======
    if (topic.startsWith("iot/") && topic.endsWith("/status")) {
      const [, device] = topic.split("/");
      const status = msg;

      // 1️⃣ Emit realtime
      io.emit("devices:update", { device, state: status });
      console.log(`📡 ${device} status: ${status}`);

      // 2️⃣ Update DeviceState
      await DeviceState.updateOne(
        { device },
        { state: status, updatedAt: new Date() },
        { upsert: true }
      );

      // 3️⃣ Update Action gần nhất (pending)
      const lastAction = await Action.findOne({ device }).sort({ timestamp: -1 }).limit(1);
      if (lastAction && lastAction.status === "pending") {
        const success = lastAction.newState === status;
        await Action.updateOne(
          { _id: lastAction._id },
          {
            status: success ? "success" : "failed",
            errorMessage: success
              ? null
              : `Expected '${lastAction.newState}', got '${status}'`,
            newState: status,
          }
        );
        console.log(`📝 Updated Action ${device} → ${success ? "✅ success" : "❌ failed"}`);
      }
    }
  } catch (err) {
    console.error("❌ MQTT message error:", err.message);
  }
});

// ================= SOCKET.IO =================
io.on("connection", (socket) => {
  console.log("🌐 Dashboard connected:", socket.id);

  socket.on("device:toggle", ({ device, state }) => {
    if (!["fan", "air", "lamp"].includes(device)) return;
    mqttClient.publish(`iot/${device}`, state);
    console.log(`📤 Toggle ${device}: ${state}`);
  });

  socket.on("disconnect", () => console.log("❌ Dashboard disconnected:", socket.id));
});

// ================= SERVER START =================
server.listen(PORT, async () => {
  await connectDB();
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
});
