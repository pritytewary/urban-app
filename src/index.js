import express from "express";
import dotenv from "dotenv";
import customerRoutes from "./routes/customer/index.js";
import { connectDB } from "./lib/db.js";
import professionalRoutes from "./routes/professional/index.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/customer", customerRoutes);
app.use("/professional", professionalRoutes);

app.listen(8080, async () => {
  await connectDB();
  console.log(`Application is listening on http://localhost:8080`);
});
