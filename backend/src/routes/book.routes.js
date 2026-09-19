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

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Library book management APIs
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search books by title or author
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, title, author, totalCopies, availableCopies, createdAt]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
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

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Database Management Systems"
 *               author:
 *                 type: string
 *                 example: "Raghu Ramakrishnan"
 *               totalCopies:
 *                 type: integer
 *                 example: 10
 *               availableCopies:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
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

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Book not found
 */
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

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Advanced Database Management Systems"
 *               author:
 *                 type: string
 *                 example: "Raghu Ramakrishnan"
 *               totalCopies:
 *                 type: integer
 *                 example: 15
 *               availableCopies:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Book not found
 */
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

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Book not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    bookController.deleteBook
);

export default router;