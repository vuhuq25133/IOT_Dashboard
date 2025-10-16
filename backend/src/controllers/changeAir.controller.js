import mqttClient from "../mqtt/mqttClient.js";
import Action from "../models/actions.model.js";
import DeviceState from "../models/deviceState.model.js";

const changeAir = async (req, res) => {
  try {
    const { state } = req.body;
    if (!["on", "off"].includes(state))
      return res.status(400).json({ message: "Invalid state" });

    const prev = await DeviceState.findOne({ device: "air" });
    const previousState = prev ? prev.state : "off";

    await DeviceState.findOneAndUpdate(
      { device: "air" },
      { state },
      { upsert: true, new: true }
    );

    await Action.create({
      device: "air",
      action: "toggle",
      previousState,
      newState: state,
      status: "success",
      triggeredBy: "user",
    });

    mqttClient.publish("iot/air", state);
    console.log(`📤 Toggle air: ${state}`);

    res.status(200).json({ airState: state });
  } catch (err) {
    console.error("❌ changeAir error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default changeAir;
