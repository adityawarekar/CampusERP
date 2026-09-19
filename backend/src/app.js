import express from "express";
import cors from "cors";

import logger from "./middleware/logger.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";
import routes from "./routes/index.js";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

app.use(helmet());

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({
    limit: "1mb"
}));

app.use(logger);

app.use(routes);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);
app.use(errorMiddleware);

export default app;