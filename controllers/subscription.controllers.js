const Subscription = require("../models/Subscription");
const logger = require("../utils/logger");

// Create a new subscription
exports.createSubscription = async (req, res) => {
  const { serviceName, serviceLink, monthlyFee, startDate, userID } = req.body;

  try {
    let newSubscription = new Subscription({
      serviceName,
      serviceLink,
      monthlyFee,
      startDate,
      userID,
    });

    newSubscription = await newSubscription.save();
    newSubscription.serviceID = newSubscription._id;
    delete newSubscription._id
    res.status(201).json({
      message: "Subscription created successfully",
      subscription: newSubscription,
    });
  } catch (err) {
    logger.error(`Error creating subscription: ${err.message}`);
    res
      .status(500)
      .json({ message: "Error creating subscription", error: err.message });
  }
};

// Get all subscriptions for a particular user
exports.getSubscriptionsByUserId = async (req, res) => {
  try {
    const subscriptions = await Subscription.aggregate([
      { $match: { userID: req.params.userId } },
      { $project: { 
          serviceID: "$_id", 
          _id: 0, 
          serviceName: 1, 
          serviceLink: 1, 
          monthlyFee: 1, 
          startDate: 1, 
          userID: 1 
        } }
    ]);
    
    if (!subscriptions || subscriptions.length === 0) {
      return res
        .status(404)
        .json({ message: "No subscriptions found for this user" });
    }
    
    res.json(subscriptions);    

    // Populate the virtual fields before responding
    const subscriptionsWithVirtuals = subscriptions.map((sub) => sub.toJSON());

    res.json(subscriptionsWithVirtuals);
  } catch (err) {
    logger.error(
      `Error fetching subscriptions for user ${req.params.userId}: ${err.message}`
    );
    res
      .status(500)
      .json({ message: "Error fetching subscriptions", error: err.message });
  }
};

// Get a single subscription by its ID
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Convert the subscription document to JSON to include virtuals
    res.json(subscription.toJSON());
  } catch (err) {
    logger.error(`Error retrieving subscription: ${err.message}`);
    res
      .status(500)
      .json({ message: "Error retrieving subscription", error: err.message });
  }
};

// Update a subscription
exports.updateSubscription = async (req, res) => {
  const { serviceName, serviceLink, monthlyFee, startDate } = req.body;
  const serviceID = req.params.id;

  try {
    const updateData = { serviceName, serviceLink, monthlyFee, startDate };
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      serviceID,
      updateData,
      { new: true }
    );

    if (!updatedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json({
      message: "Subscription updated successfully",
      subscription: updatedSubscription.toJSON(),
    });
  } catch (err) {
    logger.error(`Error updating subscription: ${err.message}`);
    res
      .status(500)
      .json({ message: "Error updating subscription", error: err.message });
  }
};

// Delete a subscription by its ID
exports.deleteSubscription = async (req, res) => {
  try {
    const deletedSubscription = await Subscription.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json({ message: "Subscription deleted successfully" });
  } catch (err) {
    logger.error(`Error deleting subscription: ${err.message}`);
    res
      .status(500)
      .json({ message: "Error deleting subscription", error: err.message });
  }
};
