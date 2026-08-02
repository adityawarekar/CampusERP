import { Router } from "express";
import departmentController from "../controllers/department.controller.js";

const router = Router();

router.get("/", departmentController.getAllDepartments);
router.get("/:id", departmentController.getDepartmentById);

export default router;