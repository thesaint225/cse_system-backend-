import * as fs from "fs";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { StudentType } from "../validadators/studentsValidator";
import Student from "../models/Students";
import { z } from "zod";
import path from "path";

// load env

const result = dotenv.config();

if (result.error) {
  console.error("❌ Failed to load .env file:", result.error.message);
  process.exit(1);
}

// Ensure MONGO_URI is defined
const mongoUri: string | undefined = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("❌ MONGO_URI is not defined in the .env file.");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    process.exit(1);
  });

//    read JSON files

const studentFilepath = path.join(__dirname, "../data", "student.json");

if (!fs.existsSync(studentFilepath)) {
  console.error(`❌ File not found: ${studentFilepath}`);
  process.exit(1);
}

let students: unknown[] = [];

try {
  students = JSON.parse(fs.readFileSync(studentFilepath, "utf-8"));
} catch (error) {
  console.error("❌ Error reading JSON file:", error);
  process.exit(1);
}
