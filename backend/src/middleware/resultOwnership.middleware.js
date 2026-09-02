import pool from "../config/db.js";

const resultOwnershipMiddleware = async (
    req,
    res,
    next
) => {

    try {

       
        if (
            req.user.role === "ADMIN" ||
            req.user.role === "FACULTY"
        ) {
            return next();
        }

        const resultId =
            Number(req.params.id);

        const result = await pool.query(
            `
            SELECT student_id
            FROM results
            WHERE id = $1;
            `,
            [resultId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Result not found"
            });
        }

        const studentId =
            result.rows[0].student_id;

        const ownership =
            await pool.query(
                `
                SELECT id
                FROM students
                WHERE id = $1
                AND user_id = $2;
                `,
                [
                    studentId,
                    req.user.id
                ]
            );

        if (ownership.rows.length === 0) {
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

export default resultOwnershipMiddleware;