import { Router } from "express";

import bookController from "../controllers/book.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = Router();

router.get(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "LIBRARY_STAFF",
        "STUDENT"
    ),
    bookController.getAllBooks
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "LIBRARY_STAFF"
    ),
    bookController.createBook
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "LIBRARY_STAFF",
        "STUDENT"
    ),
    bookController.getBookById
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "LIBRARY_STAFF"
    ),
    bookController.updateBook
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    bookController.deleteBook
);

export default router;