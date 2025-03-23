import { NextFunction, Request, Response } from "express";
import Student from "../models/Students";
import { asyncHandler } from "../help/asyncHandler";
import mongoose, { Error } from "mongoose";
import ErrorResponse from "../help/errorResponse";

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

export const getStudent = (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(200).json({
    success: "true",
    message: `show student ${id} `,
  });
};

// @description  create student
// @route        api/v1/students/
// @access       public

export const createStudent = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const student = await Student.create(req.body);
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

    const updateStudent = await Student.findByIdAndUpdate(id, req.body, {
      // return the updated student
      new: true,
      // Ensure update follows  schemaValidation
      runValidators: true,
    });
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
