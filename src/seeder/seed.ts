import * as fs from "fs";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { studentSchema } from "../validadators/studentsValidator";
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

const studentFilepath = path.join(__dirname, "../_data", "student.json");

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

// validating data before importing

const validateData = <T>(data: unknown[], schema: z.ZodSchema<T>) => {
  // validate each items
  const result = data.map((item) => schema.safeParse(item));

  //  find invalid items
  const invalidItems = result.filter((r) => !result);

  //   if there are errors , log them and stop the process

  if (invalidItems.length > 0) {
    console.error("❌ Invalid Data Found:", invalidItems);

    invalidItems.forEach((item, index) => {
      console.error(`Error ${index + 1}:`, item.error?.format());
    });

    process.exit(1);
  }
};

validateData(students, studentSchema);

// import data
const importData = async () => {
  try {
    await Student.insertMany(students);
    console.log("🚀 Data imported  Successfully...");
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Data Import Failed:, error.message");
    } else {
      console.error("❌ Data Import Failed:", error);
    }
    process.exit(1);
  }
};

// delete delete
const deleteData = async () => {
  try {
    await Student.deleteMany();
    console.log("🚀 Data Deleted Successfully...");
    process.exit();
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Data Deletion Failed:", error.message);
    } else {
      console.error("❌ Data Deletion Failed:", error);
    }

    process.exit(1);
  }
};

// Run Seeder Script Based on CLI Command
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
