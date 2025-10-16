// src/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import mqttClient from "./mqtt/mqttClient.js";
import Sensor from "./models/sensors.model.js";
import mainRoute from "./routes/main.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API IoT Dashboard 2025",
      version: "1.0.0",
      description: "Backend lưu và hiển thị dữ liệu cảm biến IoT 2025",
    },
  },
  apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/main", mainRoute);

// MQTT
mqttClient.on("connect", () => {
  console.log("✅ MQTT connected (IoT 2025)");
});

mqttClient.on("message", async (topic, message) => {
  try {
    if (topic === "sensor/datas") {
      const data = JSON.parse(message.toString());
      const { temp, humid, light } = data;
      if (
        typeof temp === "number" &&
        typeof humid === "number" &&
        typeof light === "number"
      ) {
        await Sensor.create({
          temperature: temp,
          humidity: humid,
          light: light,
          deviceId: data.deviceId || "ESP8266_001",
          timestamp: new Date(),
        });

        const vnTime = new Date(Date.now() + 7 * 3600000)
          .toISOString()
          .replace("T", " ")
          .split(".")[0];
        console.log(
          `[${vnTime}] ✅ Saved: T=${temp}°C, H=${humid}%, L=${light} lux`
        );
      }
    }

    if (topic.startsWith("iot/") && topic.endsWith("/status")) {
      const [, device] = topic.split("/");
      const status = message.toString().trim().toLowerCase();
      console.log(`📡 ${device} status: ${status}`);
    }
  } catch (err) {
    console.error("❌ MQTT message error:", err.message);
  }
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
});
