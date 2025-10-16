import DeviceState from "../models/deviceState.model.js";

export const getDeviceState = async (req, res) => {
  try {
    const states = await DeviceState.find().lean();
    const response = { fan: null, air: null, lamp: null };
    states.forEach((s) => (response[s.device] = s.state));
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
