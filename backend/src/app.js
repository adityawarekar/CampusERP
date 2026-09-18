import express from "express";
import cors from "cors";

import logger from "./middleware/logger.middleware.js";
import routes from "./routes/index.js";
import helmet from "helmet";

const app = express();

app.use(helmet());

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use(logger);

app.use(routes);

export default app;