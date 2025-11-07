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

// setInterval(async () => {
//   try {
//     const Sensors = mongoose.model('Sensors');
//     const total = await Sensors.countDocuments();
//     const keep = 1000;
//     if (total > keep) {
//       const toDelete = total - keep;
//       const ids = await Sensors.find({}, { _id: 1 })
//         .sort({ timestamp: 1, _id: 1 })
//         .limit(toDelete)
//         .lean();
//       const deleteIds = ids.map((d) => d._id);
//       if (deleteIds.length) {
//         const res = await Sensors.deleteMany({ _id: { $in: deleteIds } });
//         console.log(`🧹 Đã dọn ${res.deletedCount} Sensors cũ (giữ ${keep} bản mới nhất).`);
//       }
//     }
//   } catch (e) {
//     console.warn('Sensors cleanup error:', e?.message || e);
//   }
// }, 5 * 60 * 1000);
export default mongoose.model("Sensor", sensorSchema);
