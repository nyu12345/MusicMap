const express = require("express");
const router = express.Router();
const FriendRequest = require("../models/friendRequestSchema");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

router.get("/", (req, res) => {
  console.log("Router working");
  const filter = {};
  if (req.query.requestedId)
    filter.requestedId = req.query.requestedId;
  if (req.query.requestorId) 
    filter.requestorId = req.query.requestorId;
  FriendRequest.find(filter)
    .exec()
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// get received requests (where user is the requested)
router.get("/:requestedId", (req, res) => {
  console.log("finding request by requestedId"); 
  FriendRequest.find({ requestedId: req.params.requestedId }).then((doc) => {
    res.status(200).json(doc); 
  }).catch((err) => {
    res.status(500).json({ error: err }); 
  })
}); 

// get sent requests (where user is the requestor)
router.get("/:requestorId", (req, res) => {
  console.log("finding request by requestorId"); 
  FriendRequest.find({ requestorId: req.params.requestorId }).then((doc) => {
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

// delete a request - doesn't seem to work in postman lol idk anythign
router.delete("/:id", (req, res) => {
  console.log("deleting friend request");
  FriendRequest.findByIdAndDelete(req.params.id).then((doc) => {
    res.status(200).json(doc);
  }).catch((err) => {
    res.status(500).json({ error: err });
  })
});

module.exports = router;
