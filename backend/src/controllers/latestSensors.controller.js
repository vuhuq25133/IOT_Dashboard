import Sensor from "../models/sensors.model.js";

export const getLatestSensors = async (req, res) => {
    try {
        const data = await Sensor.find()
            .sort({ timestamp: -1 })
            .limit(10);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
