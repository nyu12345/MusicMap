const express = require("express");
const router = express.Router();
const User = require("../models/statisticsSchema");
const mongoose = require("mongoose");

router.get("/", (req, res) => {
  User.find()
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.post("/", async (req, res, next) => {
  console.log("inside post"); 
  console.log(req.body.name); 
  const user = new User({
    spotifyUsername: req.body.spotifyUsername, 
    numTrips: req.body.numTrips, 
  }); 

  user
    .save()
    .then((doc) => {
      res.status(201).json({
        message: 'Statistic created',
        createdUser: doc,
      })
    })
    .catch((err) => res.status(500).json(err));
}); 

module.exports = router;