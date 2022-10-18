require("dotenv").config({ path: "./config.env" });

const express = require("express");
const app = express();
const port = process.env.PORT; 
const roadtripRouter = require("./routes/RoadtripRoutes");
 
//middleware
app.use(express.json());
app.use("/api/roadtrips", roadtripRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const mongoose = require("mongoose");
//configure mongoose
mongoose.connect(
  process.env.ATLAS_URI || "mongodb://localhost/CRUD",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to MongoDB");
    }
  }
);
 
module.exports = app;