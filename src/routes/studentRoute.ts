import { Router } from "express";

import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController";

const router: Router = Router();

// fetch all books

router.route("/").get(getStudents).post(createStudent);
router.route("/:id").get(getStudent).put(updateStudent).delete(deleteStudent);

export default router;
