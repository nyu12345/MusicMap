const RoadtripModel = require("../models/Roadtrip");
 
exports.getAllRoadtrips = async () => {
  return await RoadtripModel.find();
};
 
exports.createRoadtrip = async (roadtrip) => {
  return await RoadtripModel.create(roadtrip);
};

exports.getRoadtripById = async (id) => {
  return await RoadtripModel.findById(id);
};
 
exports.updateRoadtrip = async (id, roadtrip) => {
  return await RoadtripModel.findByIdAndUpdate(id, roadtrip);
};

exports.deleteRoadtrip = async (id) => {
  return await RoadtripModel.findByIdAndDelete(id);
};