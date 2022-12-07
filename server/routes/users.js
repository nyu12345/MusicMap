const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

router.get("/", (req, res) => {
  const filter = {};
  if (req.query.spotifyUsername)
    filter.spotifyUsername = req.query.spotifyUsername;
  if (req.query.id) filter._id = req.query.id;
  User.find(filter)
    .exec()
    .then((doc) => {
      console.log("doc:");
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.post("/", async (req, res, next) => {
  console.log("inside post");
  console.log(req.body.name);
  console.log("friends:");
  console.log(req.body.friends);
  var friends = new Set();
  console.log(friends);

  const user = new User({
    name: req.body.name,
    spotifyUsername: req.body.spotifyUsername,
    numFriends: req.body.numFriends,
    profilePic: req.body.profilePic,
    friends: [],
    roadtrips: [],
  });

  user
    .save()
    .then((doc2) => {
      console.log("doc2:");
      console.log(doc2);
      res.status(201).json({
        message: "User created",
        createdUser: doc2,
      });
    })
    .catch((err) => res.status(500).json(err));
});

router.get("/:username", (req, res) => {
  console.log("finding user by username");
  User.find({ spotifyUsername: req.params.username })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.patch("/:_id", (req, res, next) => {
  const id = req.params._id;
  console.log(req.query.friendId);
  const filter = { _id: new ObjectId(id) };
  const friend = new ObjectId(req.query.friendId);
  console.log("new friend:");
  console.log(friend);
  User.updateOne(
    { _id: id },
    {
      $push: {
        friends: friend,
      },
    }
  )
    .exec()
    .then((doc) => {
      console.log("updated:");
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch((err) => res.status(500).json(err));
});

router.delete("/:id", (req, res) => {
  console.log("deleting user");
  User.findByIdAndDelete(req.params.id).then((doc) => {
    res.status(200).json(doc);
  }).catch((err) => {
    res.status(500).json({ error: err });
  })
});

router.patch("/update-user-roadtrip/:spotifyUsername", (req, res) => {
  console.log("Updating user's road trips");
  const roadtripId = ObjectId(req.body.roadtripId);
  User.updateOne(
    { spotifyUsername: req.params.spotifyUsername },
    { $push: { roadtrips: roadtripId } },)
    .then((doc) => {
      res.status(200).json(doc);
    }).catch((err) => {
      res.status(500).json({ error: err });
    })
});

module.exports = router;
