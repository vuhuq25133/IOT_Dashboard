import mqttClient from "../mqtt/mqttClient.js";
import Action from "../models/actions.model.js";

const changeAir = (req, res) => {
  const state = (req.body?.state || "").toString().trim().toLowerCase();
  if (state !== "on" && state !== "off") {
    return res.status(400).json({ message: "Invalid state" });
  }

  const statusTopic = "iot/air/status";
  const mqttResponseHandler = async (topic, message) => {
    if (topic !== statusTopic) return;
    const status = message.toString().trim().toLowerCase();
    console.log(`Received Air status: ${status}`);
    // Remove listener once handled
    mqttClient.removeListener("message", mqttResponseHandler);

    if (status === state) {
      try {
        await Action.create({
          device: "air",
          action: state === "on" ? "turn_on" : "turn_off",
          newState: state,
          status: "success",
          triggeredBy: "user",
          timestamp: new Date(),
        });
      } catch (e) {
        console.error("Save action (air) error:", e);
      }
      return res.status(200).json({ airState: state });
    } else {
      try {
        await Action.create({
          device: "air",
          action: state === "on" ? "turn_on" : "turn_off",
          newState: status,
          status: "failed",
          errorMessage: `Expected '${state}', got '${status}'`,
          triggeredBy: "user",
          timestamp: new Date(),
        });
      } catch (e) {
        console.error("Save action (air) error:", e);
      }
      return res.status(500).json({ message: "Failed to change Air state" });
    }
  };

  // Register listener for status response
  mqttClient.on("message", mqttResponseHandler);

  // Publish the request
  mqttClient.publish("iot/air", state);
  console.log("Sent air");
};

export default changeAir;
