import mqttClient from "../mqtt/mqttClient.js";
import Action from "../models/actions.model.js";

const changeFan = (req, res) => {
  const state = (req.body?.state || "").toString().trim().toLowerCase();
  if (state !== "on" && state !== "off") {
    return res.status(400).json({ message: "Invalid state" });
  }

  const statusTopic = "iot/fan/status";
  const mqttResponseHandler = async (topic, message) => {
    if (topic !== statusTopic) return;
    const status = message.toString().trim().toLowerCase();
    console.log(`Received Fan status: ${status}`);
    mqttClient.removeListener("message", mqttResponseHandler);

    if (status === state) {
      try {
        await Action.create({
          device: "fan",
          action: state === "on" ? "turn_on" : "turn_off",
          newState: state,
          status: "success",
          triggeredBy: "user",
          timestamp: new Date(),
        });
      } catch (e) {
        console.error("Save action (fan) error:", e);
      }
      return res.status(200).json({ fanState: state });
    } else {
      try {
        await Action.create({
          device: "fan",
          action: state === "on" ? "turn_on" : "turn_off",
          newState: status,
          status: "failed",
          errorMessage: `Expected '${state}', got '${status}'`,
          triggeredBy: "user",
          timestamp: new Date(),
        });
      } catch (e) {
        console.error("Save action (fan) error:", e);
      }
      return res.status(500).json({ message: "Failed to change Fan state" });
    }
  };

  mqttClient.on("message", mqttResponseHandler);
  mqttClient.publish("iot/fan", state);
  console.log("Sent fan");
};

export default changeFan;
