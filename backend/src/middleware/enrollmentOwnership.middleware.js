import pool from "../config/db.js";

const enrollmentOwnershipMiddleware = async (
    req,
    res,
    next
) => {

    try {

        // ADMIN and FACULTY can access any enrollment
        if (
            req.user.role === "ADMIN" ||
            req.user.role === "FACULTY"
        ) {
            return next();
        }

        const enrollmentId =
            Number(req.params.id);

        const result = await pool.query(
            `
            SELECT student_id
            FROM enrollments
            WHERE id = $1;
            `,
            [enrollmentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found"
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

export default enrollmentOwnershipMiddleware;