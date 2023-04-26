import { config } from "dotenv";
import app from "./index";

config();

const PORT: number = parseInt(process.env.PORT as string, 10) || 3005;

app.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
