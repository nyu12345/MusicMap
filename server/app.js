const express = require("express");
const roadtripRoutes = require("./routes/roadtrips");
const userRoutes = require("./routes/users");
const statisticRoutes = require("./routes/statistics");
const authRoutes = require("./routes/authentication"); 

const app = express();
const cors = require("cors");

require("./passport")(app);

// middleware, use routes for our custom API endpoints
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use("/roadtrips", roadtripRoutes);
app.use("/users", userRoutes);
app.use("/statistics", statisticRoutes);
app.use("/auth", authRoutes); 

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
