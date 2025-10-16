import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API IoT Dashboard 2025",
            version: "1.0.0",
            description: "Backend realtime cho dự án IoT 2025 (ESP8266 + DHT11 + BH1750)",
        },
        servers: [{
            url: "http://localhost:5000",
            description: "Local development server",
        }, ],
    },
    // 👇 chỉ định nơi chứa mô tả @swagger
    apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export function setupSwagger(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}