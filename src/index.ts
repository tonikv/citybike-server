import express, { Application } from "express";
//import cors from "cors";
import morgan from "morgan";
import { stationRoute } from "./routes/stations";
import { journeyRoute } from "./routes/journeys";
import databaseConnect from "./database";

const app: Application = express();

// Connect to database
databaseConnect();

// Middleware
app.use(morgan("combined"));
//app.use(cors());

// Routes
app.use("/", (_req, res) => {
    res.status(200).json({ message: "Welcome to citybike API" });
});
app.use("/stations", stationRoute);
app.use("/journeys", journeyRoute);

export default app;
