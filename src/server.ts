import { config } from "dotenv";
import app from "./index";
import databaseConnect from "./database";

config();

// Connect to database
databaseConnect();

const PORT: number = parseInt(process.env.PORT as string, 10) || 3005;

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening to ${PORT}`);
});
