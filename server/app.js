const express = require("express");
const roadtripRoutes = require("./routes/roadtrips");
const userRoutes = require("./routes/users"); 

const app = express();

//middleware, use routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/roadtrips", roadtripRoutes);
app.use("/users", userRoutes); 

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