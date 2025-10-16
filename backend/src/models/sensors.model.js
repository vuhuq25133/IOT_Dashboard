// src/models/sensors.model.js
import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema(
  {
    temperature: {
      type: Number,
      required: true,
      min: -50,
      max: 100,
    },
    humidity: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    light: {
      type: Number,
      required: true,
      min: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    deviceId: {
      type: String,
      default: "ESP8266_001",
    },
  },
  { timestamps: true }
);

// Index cho query nhanh
sensorSchema.index({ timestamp: -1 });
sensorSchema.index({ deviceId: 1, timestamp: -1 });

export default mongoose.model("Sensor", sensorSchema);
