const express = require("express");
const router = express.Router();
const {
  createSubscription,
  updateSubscription,
  getSubscriptionById,
  getSubscriptionsByUserId,
  deleteSubscription,
} = require("../controllers/subscription.controllers");
const {
  validateSubscription,
  validateUpdateSubscription,
} = require("../validators/subscription.validator");
const authenticateToken = require("../middleware/auth.middleware");

// Swagger documentation annotations
/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: API for managing subscriptions
 */

/**
 * @swagger
 * /api/subscriptions/:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceName:
 *                 type: string
 *               serviceLink:
 *                 type: string
 *               monthlyFee:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date
 *               userID:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403: 
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticateToken, validateSubscription, createSubscription);

/**
 * @swagger
 * /api/subscriptions/user/{userId}:
 *   get:
 *     summary: Get all subscriptions for a specific user
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscriptions
 *       401:
 *         description: Unauthorized
 *       403: 
 *         description: Invalid token
 *       404:
 *         description: No subscriptions found
 *       500:
 *         description: Internal server error
 */
router.get("/user/:userId", authenticateToken, getSubscriptionsByUserId);

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   get:
 *     summary: Get a subscription by ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription details
 *       401:
 *         description: Unauthorized
 *       403: 
 *         description: Invalid token
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authenticateToken, getSubscriptionById);

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   put:
 *     summary: Update a subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceName:
 *                 type: string
 *               serviceLink:
 *                 type: string
 *               monthlyFee:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403: 
 *         description: Invalid token
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authenticateToken,
  validateUpdateSubscription,
  updateSubscription
);

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   delete:
 *     summary: Delete a subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription deleted successfully
 *       401:
 *         description: Unauthorized
 *       403: 
 *         description: Invalid token
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticateToken, deleteSubscription);

module.exports = router;
