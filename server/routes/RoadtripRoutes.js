const express = require("express");
const {
  getAllRoadtrips,
  createRoadtrip,
  getRoadtripById,
  updateRoadtrip,
  deleteRoadtrip,
} = require("../controllers/RoadtripController");

const router = express.Router();

router.route("/").get(getAllRoadtrips).post(createRoadtrip);
router.route("/:id").get(getRoadtripById).put(updateRoadtrip).delete(deleteRoadtrip);

module.exports = router;