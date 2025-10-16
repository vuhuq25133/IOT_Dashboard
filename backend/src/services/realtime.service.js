// services/realtime.service.js
export function initRealtime(io, mqttClient) {
  // MQTT → Socket.IO
  mqttClient.on("message", (topic, message) => {
    const msg = message.toString();

    if (topic === "sensor/datas") {
      const data = JSON.parse(msg);
      io.emit("sensors:new", data);
    }

    if (topic.startsWith("iot/") && topic.endsWith("/status")) {
      const [, device] = topic.split("/");
      io.emit("devices:update", { device, state: msg });
    }
  });

  // Socket.IO → MQTT
  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    socket.on("device:toggle", ({ device, state }) => {
      console.log(`⚙️ Toggle ${device} → ${state}`);
      mqttClient.publish(`iot/${device}`, state);
    });

    socket.on("disconnect", () => console.log("❌ Client disconnected:", socket.id));
  });
}
