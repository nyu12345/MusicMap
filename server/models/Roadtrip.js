const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const roadtripSchema = new mongoose.Schema({
//     roadtripId: { type: Number, required: true, unique: true },
//     name: { type: String, required: true},
//     startLocation: { type: String, required: true },
//     destination: { type: String, required: true },
//     startDate: { type: String },
//     endDate: { type: String },
// });

const roadtripSchema = new mongoose.Schema({
    roadtripId: { type: Number, required: true, unique: true },
    name: { type: String }, 
    startLocation: { type: String, required: true } ,
    destination: { type: String, required: true } ,
    startDate: { type: String, required: true } ,
    endDate: { type: String, required: true }, 
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
 
module.exports = mongoose.model("Roadtrip", roadtripSchema);