const express = require("express");
const router = express.Router();
const FriendRequest = require("../models/friendRequestSchema");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

router.get("/", (req, res) => {
  console.log("Router working");
  FriendRequest.find()
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// get pending requests (where user is the requested)
router.get("/:requestedId", (req, res) => {
  console.log("finding request by requestedId"); 
  FriendRequest.find({ requestedId: req.params.requestedId }).then((doc) => {
    res.status(200).json(doc); 
  }).catch((err) => {
    res.status(500).json({ error: err }); 
  })
}); 

// post a new request
router.post("/", async (req, res, next) => {
  console.log("inside post");
  console.log("requestor:")
  console.log(req.body.requestorId);
  console.log("requested:");
  console.log(req.body.requestedId);

  const friendRequest = new FriendRequest({
    requestorId: req.body.requestorId,
    requestedId: req.body.requestedId,
  });

  friendRequest
    .save()
    .then((doc) => {
      console.log("doc:");
      console.log(doc);
      res.status(201).json({
        message: "Friend request created",
        createdReview: doc,
      });
    })
    .catch((err) => res.status(500).json(err));
});


module.exports = router;
