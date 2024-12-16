const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getUserById,
  updatePassword,
  deleteUser,
  discordAuth
} = require("../controllers/user.controllers");
const {
  validateSignup,
  validateLogin,
  validateUpdatePassword,
} = require("../validators/user.validator");
const authenticateToken = require("../middleware/auth.middleware");

// Swagger documentation annotations
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation failed
 *       409:
 *         description: User already registered
 *       500:
 *         description: Error creating user
 */
router.post("/signup", validateSignup, signup);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post("/login", validateLogin, login);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *       401:
 *         description: Unauthorized
 *       403: 
 *         description: Invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authenticateToken, getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user password
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
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
 *               password:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Password is required
 *       401:
 *         description: Unauthorized
 *       403: 
 *         description: Invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating password
 */
router.put("/:id", authenticateToken, validateUpdatePassword, updatePassword);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403: 
 *         description: Invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Error deleting user
 */
router.delete("/:id", authenticateToken, deleteUser);
// router.get("/authRedirect", discordAuth);


module.exports = router;
