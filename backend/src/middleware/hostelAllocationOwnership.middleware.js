import pool from "../config/db.js";

const hostelAllocationOwnershipMiddleware = async (
    req,
    res,
    next
) => {

    try {

        const allocationId =
            Number(req.params.id);

       
        if (
            req.user.role === "ADMIN" ||
            req.user.role === "HOSTEL_STAFF"
        ) {
            return next();
        }

        
        const result = await pool.query(
            `
            SELECT ha.student_id
            FROM hostel_allocations ha
            INNER JOIN students s
                ON ha.student_id = s.id
            WHERE ha.id = $1
            AND s.user_id = $2;
            `,
            [
                allocationId,
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

export default hostelAllocationOwnershipMiddleware;