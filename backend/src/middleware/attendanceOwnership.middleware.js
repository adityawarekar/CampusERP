import pool from "../config/db.js";

const attendanceOwnershipMiddleware = async (
    req,
    res,
    next
) => {

    try {

        
        if (req.user.role === "ADMIN") {
            return next();
        }

        let studentId;

       
        if (req.params.studentId) {

            studentId = Number(req.params.studentId);

        }

        
        else if (req.params.id) {

            const attendanceId =
                Number(req.params.id);

            const result = await pool.query(
                `
                SELECT student_id
                FROM attendance
                WHERE id = $1;
                `,
                [attendanceId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Attendance record not found"
                });
            }

            studentId = result.rows[0].student_id;
        }

        // Check ownership
        const result = await pool.query(
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

export default attendanceOwnershipMiddleware;