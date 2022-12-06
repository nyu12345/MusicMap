const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roadtripSchema = new mongoose.Schema({
  name: { type: String },
  startLocation: { type: String, required: true },
  destination: { type: String, default: null },
  startDate: { type: Schema.Types.Date, required: true },
  endDate: { type: Schema.Types.Date, default: null },
  //users: [{ type: Schema.Types.ObjectId, ref: 'User'}],
});

// generate createdAt & updatedAt fields
roadtripSchema.set("timestamps", true);

module.exports = mongoose.model("Roadtrip", roadtripSchema);
