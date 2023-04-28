import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { stationRoute } from "./routes/stations";
import { journeyRoute } from "./routes/journeys";

const app: Application = express();

// Middleware
app.use(morgan("combined"));
app.use(cors());

// Routes
app.use("/stations", stationRoute);
app.use("/journeys", journeyRoute);

export default app;
