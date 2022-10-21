const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
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
    name: req.body.name, 
    spotifyUsername: req.body.spotifyUsername, 
  }); 

  user
    .save()
    .then((doc) => {
      res.status(201).json({
        message: 'Roadtrip created',
        createdReview: doc,
      })
    })
    .catch((err) => res.status(500).json(err));
}); 

module.exports = router;