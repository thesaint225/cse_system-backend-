import mongoose, { Schema } from "mongoose";

// define user type
type studentType = {
  name: string;
  slug?: string;

  email: string;
  password: string;

  //   enum to restrict the role
  role: "admin" | "student";
  studentInfo?: {
    bio?: string;
    profilePicture?: string;
    history?: string[];
  };
};

// create the mongoose schema

const StudentSchema: Schema = new Schema<studentType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String, // Use StringConstructor, as it's a single value
      enum: ["admin", "student"], // Enum validation for single values
      default: "student",
    },
    studentInfo: {
      type: new Schema({
        bio: {
          type: String,
          trim: true,
        },
        profilePicture: {
          //  URL or path for the student's profile picture
          type: String,
        },
        history: {
          type: [String],
        },
      }),
    },
  },

  {
    timestamps: true,
  }
);

const Student = mongoose.model<studentType>("User", StudentSchema);

export default Student;
