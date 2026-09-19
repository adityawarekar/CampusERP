import { Router } from "express";

import feeController from "../controllers/fee.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import feeOwnershipMiddleware from "../middleware/feeOwnership.middleware.js";
import paymentOwnershipMiddleware from "../middleware/paymentOwnership.middleware.js";
import validate from "../middleware/validation.middleware.js";
import {
    feeQuerySchema
} from "../validators/feeQuery.validator.js";

import {
    createFeeSchema,
    createPaymentSchema,
    updateFeeSchema
} from "../validators/fee.validator.js";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Fees
 *   description: Fee and payment management APIs
 */

/**
 * @swagger
 * /fees:
 *   get:
 *     summary: Get all fee records
 *     tags: [Fees]
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
 *         name: studentId
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Partial, Paid]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, totalAmount, amountPaid, dueDate, status]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: Fees retrieved successfully
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
        "STUDENT"
    ),
    validate(
        feeQuerySchema,
        "query"
    ),
    feeController.getAllFees
);

/**
 * @swagger
 * /fees/{id}:
 *   get:
 *     summary: Get fee record by ID
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Fee record ID
 *     responses:
 *       200:
 *         description: Fee record retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Fee record not found
 */
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "STUDENT"
    ),
    feeOwnershipMiddleware,
    feeController.getFeeById
);

/**
 * @swagger
 * /fees:
 *   post:
 *     summary: Create a fee record
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 2
 *               totalAmount:
 *                 type: number
 *                 example: 50000
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-31"
 *     responses:
 *       201:
 *         description: Fee record created successfully
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
    roleMiddleware("ADMIN"),
    validate(createFeeSchema),
    feeController.createFee
);

/**
 * @swagger
 * /fees/{feeId}/payments:
 *   post:
 *     summary: Create a payment for a fee record
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: feeId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Fee record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 10000
 *               paymentDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-19"
 *               paymentMethod:
 *                 type: string
 *                 example: "UPI"
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.post(
    "/:feeId/payments",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "STUDENT"
    ),
    paymentOwnershipMiddleware,
    validate(createPaymentSchema),
    feeController.createPayment
);

/**
 * @swagger
 * /fees/{feeId}/payments:
 *   get:
 *     summary: Get payments for a fee record
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: feeId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Fee record ID
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Fee record not found
 */
router.get(
    "/:feeId/payments",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "STUDENT"
    ),
    paymentOwnershipMiddleware,
    feeController.getPaymentsByFeeId
);

/**
 * @swagger
 * /fees/{id}:
 *   put:
 *     summary: Update a fee record
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Fee record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalAmount:
 *                 type: number
 *                 example: 55000
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2027-01-15"
 *               status:
 *                 type: string
 *                 enum: [Pending, Partial, Paid]
 *     responses:
 *       200:
 *         description: Fee record updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Fee record not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    validate(updateFeeSchema),
    feeController.updateFee
);

/**
 * @swagger
 * /fees/{id}:
 *   delete:
 *     summary: Delete a fee record
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Fee record ID
 *     responses:
 *       200:
 *         description: Fee record deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Fee record not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    feeController.deleteFee
);

export default router;