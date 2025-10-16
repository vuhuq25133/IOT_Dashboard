import mqttClient from "../mqtt/mqttClient.js";
import Action from "../models/actions.model.js";
import DeviceState from "../models/deviceState.model.js";

const changeLamp = async (req, res) => {
  try {
    const { state } = req.body;
    if (!["on", "off"].includes(state))
      return res.status(400).json({ message: "Invalid state" });

    const prev = await DeviceState.findOne({ device: "lamp" });
    const previousState = prev ? prev.state : "off";

    await DeviceState.findOneAndUpdate(
      { device: "lamp" },
      { state },
      { upsert: true, new: true }
    );

    await Action.create({
      device: "lamp",
      action: "toggle",
      previousState,
      newState: state,
      status: "success",
      triggeredBy: "user",
    });

    mqttClient.publish("iot/lamp", state);
    console.log(`📤 Toggle lamp: ${state}`);

    res.status(200).json({ lampState: state });
  } catch (err) {
    console.error("❌ changeLamp error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default changeLamp;
