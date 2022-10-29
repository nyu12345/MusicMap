const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const membershipSchema = new Schema({
  spotifyId: { type: String, required: true },
  accessToken: String,
  refreshToken: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// generate createdAt & updatedAt fields
membershipSchema.set("timestamps", true);

membershipSchema.statics.findAccessToken = async function (userId, provider) {
  const membership = await this.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    provider,
  });

  return membership;
};

module.exports = mongoose.model("Membership", membershipSchema);
