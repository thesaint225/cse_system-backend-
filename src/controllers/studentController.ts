import { NextFunction, Request, Response } from "express";
import Student from "../models/Students";
import { asyncHandler } from "../help/asyncHandler";
import mongoose, { Error } from "mongoose";
import ErrorResponse from "../help/errorResponse";
import { studentSchema } from "../validadators/stusentsValidator";

// @description show all users
// @route api/v1/students
// @access public
export const getStudents = asyncHandler(
  async (_req: Request, res: Response) => {
    const students = await Student.find({});
    res.status(200).json({
      success: true,
      msg: "show all students",
      data: students,
    });
  }
);

// @description single student
// @route       api/v1/students/:id
// @access      public

export const getStudent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorResponse(`Invalid ID: ${id}`, 400));
    }

    const getStudent = await Student.findById(id);

    if (!getStudent) {
      return next(new ErrorResponse(`No student found with ID: ${id}`, 404));
    }
    res.status(200).json({
      success: true,
      message: `show student ${id} `,
      data: getStudent,
    });
  }
);

// @description  create student
// @route        api/v1/students/
// @access       public

export const createStudent = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    // valid request body using zod
    const validationResult = studentSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: validationResult.error.format(),
      });
    }
    const student = await Student.create(validationResult);
    res.status(201).json({
      success: true,
      data: student,
    });
  }
);

// @description  update student
// @route        api/v1/students/
// @access       public

export const updateStudent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    // check if id is valid ObjectId before querying the db
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorResponse(`Invalid ID: ${id}`, 400));
    }

    // valid request body using zod
    const validationResult = studentSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: validationResult.error.format(),
      });
    }

    const updateStudent = await Student.findByIdAndUpdate(
      id,
      validationResult,
      {
        // return the updated student
        new: true,
        // Ensure update follows  schemaValidation
        runValidators: true,
      }
    );
    if (!updateStudent) {
      return next(new ErrorResponse(`No student found with ID: ${id}`, 400));
    }

    res.status(200).json({
      success: true,
      msg: `update student  ${id}`,
      data: updateStudent,
    });
  }
);

export const deleteStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    // this is check is the id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new ErrorResponse(`Invalid ID: ${id}`, 400);
    }
    const deleteStudent = await Student.findByIdAndDelete(id);

    if (!deleteStudent) {
      return new ErrorResponse(`No student found with ID: ${id}`, 400);
    }
    res.status(200).json({
      success: true,
      message: `delete student ${id}`,
      data: {},
    });
  }
);
