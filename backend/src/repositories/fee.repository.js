import pool from "../config/db.js";

class FeeRepository {

    async findAll() {

        const query = `
            SELECT
                fee_records.id,
                students.id AS student_id,
                students.roll_number,
                students.first_name || ' ' || students.last_name AS student_name,
                fee_records.total_amount,
                fee_records.amount_paid,
                fee_records.total_amount - fee_records.amount_paid AS remaining_amount,
                fee_records.due_date,
                fee_records.status
            FROM fee_records
            INNER JOIN students
                ON fee_records.student_id = students.id
            ORDER BY fee_records.id;
        `;

        const result = await pool.query(query);

        return result.rows;
    }

    async findAllByUserId(userId) {

        const query = `
        SELECT
            fee_records.id,
            students.id AS student_id,
            students.roll_number,
            students.first_name || ' ' || students.last_name AS student_name,
            fee_records.total_amount,
            fee_records.amount_paid,
            fee_records.total_amount - fee_records.amount_paid AS remaining_amount,
            fee_records.due_date,
            fee_records.status
        FROM fee_records
        INNER JOIN students
            ON fee_records.student_id = students.id
        WHERE students.user_id = $1
        ORDER BY fee_records.id;
    `;

        const result = await pool.query(query, [userId]);

        return result.rows;
    }

    async findById(id) {

        const query = `
        SELECT
            fee_records.id,
            students.id AS student_id,
            students.roll_number,
            students.first_name || ' ' || students.last_name AS student_name,
            fee_records.total_amount,
            fee_records.amount_paid,
            fee_records.total_amount - fee_records.amount_paid AS remaining_amount,
            fee_records.due_date,
            fee_records.status
        FROM fee_records
        INNER JOIN students
            ON fee_records.student_id = students.id
        WHERE fee_records.id = $1;
    `;

        const result = await pool.query(query, [id]);

        return result.rows[0];
    }

    async findStudentById(studentId) {
        const query = `
            SELECT Id
            FROM students
            WHERE id = $1;   
         `;

        const result = await pool.query(query, [studentId]);


        return result.rows[0];
    }

    async findByStudentId(studentId) {
        const query = `
           SELECT id
           FROM fee_records
           WHERE student_id = $1; 
        `;

        const result = await pool.query(query, [studentId]);

        return result.rows[0];
    }

    async create(
        studentId,
        totalAmount,
        dueDate
    ) {
        const query = `
          INSERT INTO fee_records (
              student_id,
              total_amount,
              due_date
          )
           VALUES ($1, $2, $3)
           RETURNING
               id,
               student_id,
               total_amount,
               amount_paid,
               due_date,
               status,
               created_at;    
        `;

        const result = await pool.query(query, [
            studentId,
            totalAmount,
            dueDate
        ]);
        return result.rows[0];
    }


    async createPayment(feeId, amount, paymentMethod) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const feeResult = await client.query(
                `
                SELECT
                    id,
                    total_amount,
                    amount_paid
                FROM fee_records
                WHERE id = $1
                FOR UPDATE;    
                
                `,
                [feeId]
            );

            if (feeResult.rows.length === 0) {
                throw new Error("Fee record not found");
            }

            const fee = feeResult.rows[0];

            const remainingAmount =
                Number(fee.total_amount) -
                Number(fee.amount_paid);

            if (amount > remainingAmount) {
                throw new Error(
                    "Payment exceeds remaining fee"
                );
            }

            const paymentResult = await client.query(
                `
                INSERT INTO payments (
                    fee_id,
                    amount,
                    payment_method
                )
                VALUES ($1, $2, $3)
                RETURNING
                    id,
                    fee_id,
                    amount,
                    payment_date,
                    payment_method;
                    
                `,
                [feeId, amount, paymentMethod]
            );

            const newAmountPaid =
                Number(fee.amount_paid) +
                Number(amount);

            const newStatus =
                newAmountPaid === Number(fee.total_amount)
                    ? "Paid"
                    : "Partial";

            await client.query(
                `
                UPDATE fee_records
                SET
                   amount_paid = $2,
                   status = $3,
                   updated_at = CURRENT_TIMESTAMP
                WHERE id = $1;   
                
                `,
                [
                    feeId,
                    newAmountPaid,
                    newStatus
                ]
            );

            await client.query("COMMIT");

            return paymentResult.rows[0];

        } catch (error) {
            await client.query("ROLLBACK");

            throw error;
        } finally {
            client.release();
        }
    }

    async findPaymentsByFeeId(feeId) {

        const query = `
        SELECT
            payments.id,
            payments.fee_id,
            payments.amount,
            payments.payment_date,
            payments.payment_method
        FROM payments
        WHERE payments.fee_id = $1
        ORDER BY payments.payment_date DESC;
    `;

        const result = await pool.query(query, [feeId]);

        return result.rows;
    }

    async update(id, totalAmount, dueDate) {
        const query = `
            UPDATE fee_records
            SET
                total_amount = $2,
                due_date = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING
                id,
                student_id,
                total_amount,
                amount_paid,
                due_date,
                status,
                updated_at;       
        `;

        const result = await pool.query(query, [
            id,
            totalAmount,
            dueDate
        ]);

        return result.rows[0];
    }

    async findPaymentsByFeeId(feeId) {

        const query = `
        SELECT id
        FROM payments
        WHERE fee_id = $1;
    `;

        const result = await pool.query(query, [feeId]);

        return result.rows;
    }

    async delete(id) {

        const query = `
        DELETE FROM fee_records
        WHERE id = $1
        RETURNING
            id,
            student_id,
            total_amount,
            amount_paid,
            due_date,
            status;
    `;

        const result = await pool.query(query, [id]);

        return result.rows[0];
    }



}

export default new FeeRepository();