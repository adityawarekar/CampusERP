import { Router } from "express";
import bookController from "../controllers/book.controller.js";

const router = Router();

router.get("/", bookController.getAllBooks);
router.post("/", bookController.createBook);
router.get("/:id", bookController.getBookById);
router.put("/:id", bookController.updateBook);
router.delete("/:id",bookController.deleteBook);

export default router;