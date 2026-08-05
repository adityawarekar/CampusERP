import express from "express";
import logger from "./middleware/logger.middleware.js";
import routes from "./routes/index.js"

const app = express();

app.use(express.json());

app.use(logger);
app.use(routes);


export default app;