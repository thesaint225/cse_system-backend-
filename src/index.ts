import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import router from "./routes/studentRoute";
import * as dotenv from "dotenv";
import connectDb from "./config/db";

// load environment variables first
if (!process.env.MONGO_URI) {
  throw new Error("Missing MONGO_URI");
}
dotenv.config();

// connect database
connectDb();

const app: Application = express();
//body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const PORT = process.env.PORT || 3000;

// Mount the route

app.use("/api/v1/students", router);

app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
