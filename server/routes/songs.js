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
  console.log(
    "Posting song: %s from tripId: %s",
    req.body.title,
    req.body.tripId
  );
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
    songInfo: {
      albumID: req.body.songInfo.albumID, 
      albumName: req.body.songInfo.albumName, 
      releaseDate: req.body.songInfo.releaseDate, 
      trackPopularity: req.body.songInfo.trackPopularity, 
      trackPreviewURL: req.body.songInfo.trackPreviewURL, 
      acousticness: req.body.songInfo.acousticness, 
      danceability: req.body.songInfo.danceability, 
      duration_ms: req.body.songInfo.duration_ms, 
      energy: req.body.songInfo.energy, 
      instrumentalness: req.body.songInfo.instrumentalness, 
      key: req.body.songInfo.key, 
      liveness: req.body.songInfo.liveness, 
      loudness: req.body.songInfo.loudness, 
      mode: req.body.songInfo.mode, 
      speechiness: req.body.songInfo.speechiness, 
      tempo: req.body.songInfo.tempo, 
      timeSignature: req.body.songInfo.timeSignature, 
      valence: req.body.songInfo.valence, 
    }, 
    datestamp: req.body.datestamp,
  });

  song
    .save()
    .then((doc) => {
      res.status(201).json({
        message: "Song created",
        createdReview: doc,
      });
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
