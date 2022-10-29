const express = require("express");
const passport = require("passport");
const router = express.Router();

//let baseUrl = "";

// This is a hack to get around the fact that our backend server
// that social media sites need to call back to is on a different
// port than our front end when we're running in development mode
// if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
//   baseUrl = "http://localhost:3000";
// }

// initiate the spotify login
router.get("/auth/spotify", passport.authenticate("spotify"), (req, res) => {
  res.end();
});

// Spotify callback to finish logging in
router.get(
  "/auth/spotify/callback",
  passport.authenticate("spotify", {
    failureRedirect: `${baseUrl}/auth/failed`, 
    successRedirect: `${baseUrl}/testspotify`, 
  })
);

// Serve up static assets (usually on heroku)
// router.use(
//   express.static("client/build", {
//     index: false,
//   })
// );

module.exports = router;