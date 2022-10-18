const roadtripService = require("../services/RoadtripService");

exports.getAllRoadtrips = async (req, res) => {
  try {
    const roadtrips = await roadtripService.getAllRoadtrips();
    res.json({ data: roadtrips, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRoadtrip = async (req, res) => {
  try {
    const roadtrips = await roadtripService.createRoadtrip(req.body);
    res.json({ data: roadtrip, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.getRoadtripById = async (req, res) => {
  try {
    const roadtrip = await roadtripService.getRoadtripById(req.params.id);
    res.json({ data: roadtrip, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.updateRoadtrip = async (req, res) => {
  try {
    const roadtrip = await roadtripService.updateRoadtrip(req.params.id, req.body);
    res.json({ data: roadtrip, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.deleteRoadtrip = async (req, res) => {
  try {
    const roadtrip = await roadtripService.deleteRoadtrip(req.params.id);
    res.json({ data: roadtrip, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};