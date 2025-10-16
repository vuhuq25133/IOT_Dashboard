import mongoose from "mongoose";

const deviceStateSchema = new mongoose.Schema({
    device: {
        type: String,
        enum: ["fan", "air", "lamp"],
        required: true,
        unique: true,
    },
    state: {
        type: String,
        enum: ["on", "off"],
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("DeviceState", deviceStateSchema);