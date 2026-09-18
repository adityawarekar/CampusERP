import { Router } from "express";

import bookController from "../controllers/book.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validate
    from "../middleware/validation.middleware.js";

import {
    createBookSchema,
    updateBookSchema
} from "../validators/book.validator.js";


import {
    bookQuerySchema
} from "../validators/bookQuery.validator.js";
const router = Router();

router.get(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "LIBRARY_STAFF",
        "STUDENT"
    ),
    validate(
    bookQuerySchema,
    "query"
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
    validate(createBookSchema),
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
    validate(updateBookSchema),
    bookController.updateBook
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    bookController.deleteBook
);

export default router;