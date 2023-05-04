/* eslint-disable no-console */
// Connect to MongoDB
import { config } from "dotenv";
import mongoose from "mongoose";

config();

const URI: string =
    process.env.MONGOURI || "mongodb://localhost:27017/bikedata";

const databaseConnect = async () => {
    try {
        mongoose.connect(URI);
        console.log("Database connected!");
    } catch (error) {
        console.error(error);
    }
};

export default databaseConnect;
