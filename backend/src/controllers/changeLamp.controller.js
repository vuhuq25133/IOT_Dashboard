import mqttClient from "../mqtt/mqttClient.js";
import Action from "../models/actions.model.js";

const changeLamp = (req, res) => {
  const state = (req.body?.state || "").toString().trim().toLowerCase();
  if (state !== "on" && state !== "off") {
    return res.status(400).json({ message: "Invalid state" });
  }

  const statusTopic = "iot/lamp/status";
  const mqttResponseHandler = async (topic, message) => {
    if (topic !== statusTopic) return;
    const status = message.toString().trim().toLowerCase();
    console.log(`Received Lamp status: ${status}`);
    mqttClient.removeListener("message", mqttResponseHandler);

    if (status === state) {
      try {
        await Action.create({
          device: "lamp",
          action: state === "on" ? "turn_on" : "turn_off",
          newState: state,
          status: "success",
          triggeredBy: "user",
          timestamp: new Date(),
        });
      } catch (e) {
        console.error("Save action (lamp) error:", e);
      }
      return res.status(200).json({ lampState: state });
    } else {
      try {
        await Action.create({
          device: "lamp",
          action: state === "on" ? "turn_on" : "turn_off",
          newState: status,
          status: "failed",
          errorMessage: `Expected '${state}', got '${status}'`,
          triggeredBy: "user",
          timestamp: new Date(),
        });
      } catch (e) {
        console.error("Save action (lamp) error:", e);
      }
      return res.status(500).json({ message: "Failed to change Lamp state" });
    }
  };

  mqttClient.on("message", mqttResponseHandler);
  mqttClient.publish("iot/lamp", state);
  console.log("Sent lamp");
};

export default changeLamp;
