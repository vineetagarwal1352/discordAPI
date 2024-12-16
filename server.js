const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./utils/swagger");
const logger = require("./utils/logger");
const userRoutes = require('./routes/user.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const connectDB = require("./config/db");

// Load environment variables
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

// Middleware
app.use(bodyParser.json());
app.use(helmet());

// Swagger Documentation Endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.set('view engine', 'ejs');

// Route to render the EJS page
app.get('/api/users/authDiscord', (req, res) => {
  res.render('index', { authUrl: process.env.DISCORD_AUTH_URI });
});

app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);


// Connect to MongoDB
connectDB();

// Start Server
app.listen(PORT, HOST, () => {
  logger.info(`Server started on ${HOST}:${PORT}`);
});
