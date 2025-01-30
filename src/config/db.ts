import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error(
        "MONGO_URI is missing or undefined in the .env file .Please verify your .env file to ensure the correct configuration"
      );
    }
    // Initial connection
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");

    // handle error after Initial connection
    mongoose.connection.on("error", (err) => {
      console.log("Error after initial connection,", err.message);
    });

    // handle disconnection
    mongoose.connection.on("disconnected", () => {
      console.error("MongoDb discounted.Attempting to reconnect...");
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error connecting to mongoDb", error.message);
    } else {
      console.error("An unexpected error occurred ", error);
    }
    //   Exit the process if the database connection fails
    process.exit(1);
  }
};

export default connectDb;
