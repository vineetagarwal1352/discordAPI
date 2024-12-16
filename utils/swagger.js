const swaggerJsDoc = require("swagger-jsdoc");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const HOST =
  (process.env.HOST !== "0.0.0.0" && process.env.HOST) || "localhost";
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pixel Phant Task-1",
      version: "1.0.0",
      description:
        "API for user management and subscription service management.",
    },
    servers: [
      {
        url: `http://${HOST}:${PORT}`,
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            userID: {
              type: "string",
              description: "The unique identifier of the user",
            },
            username: {
              type: "string",
              description: "The username of the user",
            },
            email: {
              type: "string",
              description: "The email of the user",
            },
            password: {
              type: "string",
              description: "The password of the user (hashed)",
            },
          },
        },
        Subscription: {
          type: "object",
          properties: {
            serviceID: {
              type: "string",
              description: "The unique identifier for the subscription service",
            },
            serviceName: {
              type: "string",
              description: "The name of the subscription service",
            },
            serviceLink: {
              type: "string",
              description: "The URL link to the subscription service",
            },
            monthlyFee: {
              type: "number",
              description: "The monthly fee for the subscription service",
            },
            startDate: {
              type: "string",
              format: "date",
              description: "The start date of the subscription",
            },
            userID: {
              type: "string",
              description:
                "The ID of the user to whom the subscription belongs",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // assuming your route files are in the routes folder
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
