const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  tripId: { type: String, required: true },
  spotifyId: { type: String, required: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  imageURL: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    name: { type: String, required: true },
  },
  songInfo: {
    albumID: { type: String },
    albumName: { type: String },
    releaseDate: { type: String },
    trackPopularity: { type: Number },
    trackPreviewURL: { type: String },
    acousticness: { type: Number },
    danceability: { type: Number },
    duration_ms: { type: Number },
    energy: { type: Number },
    instrumentalness: { type: Number },
    key: { type: Number },
    liveness: { type: Number },
    loudness: { type: Number },
    mode: { type: Number },
    speechiness: { type: Number },
    tempo: { type: Number },
    timeSignature: { type: Number },
    valence: { type: Number },
  },
  datestamp: { type: String, required: true },
});

module.exports = mongoose.model("Song", songSchema);
