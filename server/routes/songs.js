const express = require("express");
const router = express.Router();
const Song = require("../models/songSchema");
const mongoose = require("mongoose");

router.get("/get-trip-songs/:tripId", (req, res) => {
    console.log("Getting song for trip: %s", req.params.tripId);
    Song.find({ tripId: req.params.tripId })
        .exec()
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

router.post("/create-song", async (req, res, next) => {
    console.log("Posting song: %s from tripId: %s", req.body.title, req.body.tripId);
    const song = new Song({
        tripId: req.body.tripId,
        spotifyId: req.body.spotifyId,
        title: req.body.title,
        artist: req.body.artist,
        imageURL: req.body.imageURL,
        location: {
            latitude: req.body.location.latitude,
            longitude: req.body.location.longitude,
            name: req.body.location.name,
        },
        datestamp: req.body.datestamp,
    });

    song
        .save()
        .then((doc) => {
            res.status(201).json({
                message: 'Song created',
                createdReview: doc,
            })
        })
        .catch((err) => res.status(500).json(err));
});

module.exports = router;