import pool from "../config/db.js";

const feeOwnershipMiddleware = async (
    req,
    res,
    next
) => {

    try {

        const feeId =
            Number(req.params.id);

        // ADMIN can access any fee
        if (req.user.role === "ADMIN") {
            return next();
        }

        const result = await pool.query(
            `
            SELECT fr.id
            FROM fee_records fr
            INNER JOIN students s
                ON fr.student_id = s.id
            WHERE fr.id = $1
            AND s.user_id = $2;
            `,
            [
                feeId,
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

export default feeOwnershipMiddleware;