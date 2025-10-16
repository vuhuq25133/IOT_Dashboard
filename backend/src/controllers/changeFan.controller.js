import mqttClient from "../mqtt/mqttClient.js";
import Action from "../models/actions.model.js";
import DeviceState from "../models/deviceState.model.js";

const changeFan = async (req, res) => {
  try {
    const { state } = req.body;
    if (!["on", "off"].includes(state))
      return res.status(400).json({ message: "Invalid state" });

    // Lấy trạng thái trước đó
    const prev = await DeviceState.findOne({ device: "fan" });
    const previousState = prev ? prev.state : "off";

    // Cập nhật trạng thái mới
    await DeviceState.findOneAndUpdate(
      { device: "fan" },
      { state },
      { upsert: true, new: true }
    );

    // Lưu vào Action History
    await Action.create({
      device: "fan",
      action: "toggle",
      previousState,
      newState: state,
      status: "success",
      triggeredBy: "user",
    });

    // Gửi MQTT
    mqttClient.publish("iot/fan", state);
    console.log(`📤 Toggle fan: ${state}`);

    res.status(200).json({ fanState: state });
  } catch (err) {
    console.error("❌ changeFan error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default changeFan;
