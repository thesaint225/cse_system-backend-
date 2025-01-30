import { Request, Response } from "express";
import Student from "../models/students";
import { MongoServerError } from "mongodb";

// @description show all users
// @route api/v1/students
// @access public
export const getStudents = (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    msg: "show all students",
  });
};

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

export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    if (error instanceof MongoServerError) {
      res.status(400).json({
        success: true,
        message: `Duplicate key error: ${JSON.stringify(error.keyValue)}`,
        details: error.errmsg,
      });
    } else {
      res.status(500).json({
        success: false,
        msg: "server Error ",
      });
    }
  }
};

// @description  update student
// @route        api/v1/students/
// @access       public

export const updateStudent = (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    msg: `update student  ${id}`,
  });
};

export const deleteStudent = (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    message: `delete student ${id}`,
    data: {},
  });
};
