#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <DHT.h>
#include <BH1750.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

// ====== PIN CONFIGURATION ======
#define DHTPIN D4
#define DHTTYPE DHT11
#define LAMP D7
#define FAN_PIN D6
#define AIR_CONDITIONER D5
#define SDA_PIN D3
#define SCL_PIN D2

// ====== SENSOR OBJECTS ======
DHT dht(DHTPIN, DHTTYPE);
BH1750 lightMeter;

// ====== WIFI & MQTT CONFIG ======
const char* ssid = "WALKER #25133";
const char* password = "66669999";
const char* mqtt_broker = "172.20.10.7";
const int mqtt_port = 1883;
const char* mqtt_username = "iotuser";
const char* mqtt_password = "iotpass";

// ====== MQTT TOPICS ======
const char* topicFan = "iot/fan";
const char* topicAir = "iot/air";
const char* topicLamp = "iot/lamp";
const char* topicSensor = "sensor/datas";

WiFiClient espClient;
PubSubClient client(espClient);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 7 * 3600, 60000); // GMT+7

// ====== WIFI CONNECT ======
void connectWifi() {
  Serial.println("\n🔌 Connecting WiFi...");
  WiFi.begin(ssid, password);

  unsigned long startAttempt = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startAttempt < 15000) {
    client.loop();   // vẫn xử lý MQTT trong khi chờ Wi-Fi
    yield();
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("✅ WiFi connected!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("❌ WiFi failed, retrying...");
  }
}

// ====== DEVICE CONTROL ======
void setFan(bool status) {
  digitalWrite(FAN_PIN, status ? HIGH : LOW);
  client.publish("iot/fan/status", status ? "on" : "off");
}

void setAirConditioner(bool status) {
  digitalWrite(AIR_CONDITIONER, status ? HIGH : LOW);
  client.publish("iot/air/status", status ? "on" : "off");
}

void setLamp(bool status) {
  digitalWrite(LAMP, status ? HIGH : LOW);
  client.publish("iot/lamp/status", status ? "on" : "off");
}

// ====== MQTT CALLBACK ======
void callback(char* topic, byte* payload, unsigned int length) {
  payload[length] = '\0';
  String message = String((char*)payload);

  if (strcmp(topic, "iot/fan") == 0)
    setFan(message == "on");
  else if (strcmp(topic, "iot/air") == 0)
    setAirConditioner(message == "on");
  else if (strcmp(topic, "iot/lamp") == 0)
    setLamp(message == "on");
}

// ====== MQTT CONNECTION ======
void connectMqtt() {
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
}

void reconnect() {
  static unsigned long lastAttempt = 0;
  if (millis() - lastAttempt < 3000) return;  // tránh spam
  lastAttempt = millis();

  if (!client.connected()) {
    Serial.print("🔄 MQTT reconnecting...");
    if (client.connect("ESP8266Client", mqtt_username, mqtt_password)) {
      Serial.println(" ✅ Connected");
      client.subscribe(topicFan);
      client.subscribe(topicAir);
      client.subscribe(topicLamp);

      // ✅ Gửi lại trạng thái thiết bị hiện tại ngay sau khi kết nối thành công
      client.publish("iot/fan/status", digitalRead(FAN_PIN) ? "on" : "off", true);
      client.publish("iot/air/status", digitalRead(AIR_CONDITIONER) ? "on" : "off", true);
      client.publish("iot/lamp/status", digitalRead(LAMP) ? "on" : "off", true);
    } else {
      Serial.print("❌ MQTT failed, rc=");
      Serial.println(client.state());
    }
  }
}

// ====== PUBLISH SENSOR DATA ======
void readSensorsAndPublish() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  float lux = lightMeter.readLightLevel();
  if (lux < 0) lux = 0; // trường hợp gửi -2 lên server do lỗi cảm biến
  if (isnan(humidity) || isnan(temperature) || isnan(lux)) {
    Serial.println("⚠️ Sensor read error!");
    return;
  }

  String payload = "{\"temp\":" + String(temperature, 1) +
                   ",\"humid\":" + String(humidity, 1) +
                   ",\"light\":" + String(lux, 1) + "}";

  bool ok = client.publish(topicSensor, payload.c_str());
  String nowStr = timeClient.getFormattedTime();

  Serial.printf("[%s] PUB -> %s : %s %s\n",
                nowStr.c_str(), topicSensor, payload.c_str(), ok ? "[OK]" : "[FAIL]");
}

// ====== SETUP ======
void setup() {
  Serial.begin(115200);
  pinMode(FAN_PIN, OUTPUT);
  pinMode(AIR_CONDITIONER, OUTPUT);
  pinMode(LAMP, OUTPUT);
  digitalWrite(LAMP, LOW);
  digitalWrite(FAN_PIN, LOW);
  digitalWrite(AIR_CONDITIONER, LOW);

  connectWifi();
  connectMqtt();
  dht.begin();
  Wire.begin(SDA_PIN, SCL_PIN);
  lightMeter.begin();
  timeClient.begin();
}

// ====== LOOP ======
void loop() {
  if (WiFi.status() != WL_CONNECTED) connectWifi();
  if (!client.connected()) reconnect();

  client.loop();
  timeClient.update();

  static unsigned long lastSend = 0;
  unsigned long now = millis();
  const unsigned long interval = 2000;

  if (now - lastSend >= interval) {
    lastSend = now;
    readSensorsAndPublish();
  }
}
