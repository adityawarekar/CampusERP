import pool from "../config/db.js";

const bookIssueOwnershipMiddleware = async (
    req,
    res,
    next
) => {

    try {

        const requestedStudentId =
            Number(req.params.studentId);

        if (
            req.user.role === "ADMIN" ||
            req.user.role === "LIBRARY_STAFF"
        ) {
            return next();
        }

        const result = await pool.query(
            `
            SELECT id
            FROM students
            WHERE id = $1
            AND user_id = $2;
            `,
            [
                requestedStudentId,
                req.user.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        next();

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export default bookIssueOwnershipMiddleware;