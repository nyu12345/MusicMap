const express = require("express");
const router = express.Router();
const Image = require("../models/imageSchema");
const mongoose = require("mongoose");

router.get("/get-trip-imagess/:tripId", (req, res) => {
    console.log("Getting images for trip: %s", req.params.tripId);
    Image.find({ tripId: req.params.tripId })
        .exec()
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

router.post("/create-image", async (req, res, next) => {
    console.log("Posting image: %s from tripId: %s", req.body.title, req.body.tripId);
    const image = new Image({
        tripId: req.body.tripId,
        imageURL: req.body.imageURL,
        location: {
            latitude: req.body.location.latitude,
            longitude: req.body.location.longitude,
            name: req.body.location.name,
        },
        datestamp: req.body.datestamp,
    });

    image
        .save()
        .then((doc) => {
            res.status(201).json({
                message: 'Image created',
                createdReview: doc,
            })
        })
        .catch((err) => res.status(500).json(err));
});

module.exports = router;