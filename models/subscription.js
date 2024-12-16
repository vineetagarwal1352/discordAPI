const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    serviceName: { type: String, required: true },
    serviceLink: { type: String, required: true },
    monthlyFee: { type: Number, required: true },
    startDate: { type: Date, required: true },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  }
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription;
