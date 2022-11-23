const express = require("express");
const roadtripRoutes = require("./routes/roadtrips");
const songRoutes = require("./routes/songs");
const userRoutes = require("./routes/users");
const statisticRoutes = require("./routes/statistics");
const friendRequestRoutes = require("./routes/friendRequests")

const app = express();
const cors = require('cors');

//middleware, use routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use("/roadtrips", roadtripRoutes);
app.use("/songs", songRoutes);
app.use("/users", userRoutes);
app.use("/statistics", statisticRoutes);
app.use("/friendRequests", friendRequestRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;