// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const dotenv = require("dotenv");
dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Virtual Event Management API",
      version: "1.0.0",
      description: "API documentation for the Virtual Event Management Platform, Please check the readme file and run through postman.",
    },
    servers: [
      {
        url: process.env.APP_BASE_URL, // Change this to your deployed URL in prod
      },
    ],
  },
  apis: ["./routes/*.js","./controllers/*.js"], // path to files with JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(
    `Swagger docs available at http://localhost:${port}/api-docs`
  );
}

module.exports = swaggerDocs;
