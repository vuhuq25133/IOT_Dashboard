// src/mqtt/mqttClient.js
import mqtt from "mqtt";

const MQTT_HOST = process.env.MQTT_HOST || "172.20.10.7";
const MQTT_PORT = Number(process.env.MQTT_PORT) || 1883;
const MQTT_USERNAME = process.env.MQTT_USERNAME || "iotuser";
const MQTT_PASSWORD = process.env.MQTT_PASSWORD || "iotpass";

const options = {
    host: MQTT_HOST,
    port: MQTT_PORT,
    clientId: "iot-backend-" + Math.random().toString(16).substring(2, 8),
    clean: true,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
};

const mqttClient = mqtt.connect(options);

mqttClient.on("connect", () => {
    console.log(`📡 MQTT connected to ${MQTT_HOST}:${MQTT_PORT}`);

    const topics = [
        "sensor/datas",
        "iot/fan/status",
        "iot/air/status",
        "iot/lamp/status",
    ];

    topics.forEach((topic) => {
        mqttClient.subscribe(topic, (err) => {
            if (err) console.error(`❌ Failed to subscribe: ${topic}`);
            else console.log(`✅ Subscribed: ${topic}`);
        });
    });
});

mqttClient.on("error", (err) => {
    console.error("⚠️ MQTT error:", err.message);
});

export default mqttClient;