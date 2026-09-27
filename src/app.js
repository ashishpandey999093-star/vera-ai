import express from "express";
import veraRoutes from "./routes/vera.routes.js";

const app = express();

app.use(express.json());

app.use("/v1", veraRoutes);

export default app;