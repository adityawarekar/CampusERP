import { Router } from "express";
import resultController from "../controllers/result.controller.js";

const router = Router();

router.get("/", resultController.getAllResults);
router.get("/:id", resultController.getResultById);
router.post("/", resultController.createResult);
router.put("/:id", resultController.updateResult);
router.delete("/:id", resultController.deleteResult);

export default router;