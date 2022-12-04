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
    albumID: { type: String, required: true },
    albumName: { type: String, required: true },
    releaseDate: { type: String, required: true },
    trackPopularity: { type: Number, required: true },
    trackPreviewURL: { type: String, required: true },
    acousticness: { type: Number, required: true },
    danceability: { type: Number, required: true },
    duration_ms: { type: Number, required: true },
    energy: { type: Number, required: true },
    instrumentalness: { type: Number, required: true },
    key: { type: Number, required: true },
    liveness: { type: Number, required: true },
    loudness: { type: Number, required: true },
    modality: { type: Number, required: true },
    speechiness: { type: Number, required: true },
    tempo: { type: Number, required: true },
    timeSignature: { type: Number, required: true },
    valence: { type: Number, required: true },
  },
  datestamp: { type: String, required: true },
});

module.exports = mongoose.model("Song", songSchema);
