import pool from "../config/db.js";

class StudentRepository {

    async findAll(limit, offset, departmentId, search, sortBy, order) {
        const ALLOWED_SORT_COLUMNS = {
            rollNumber: "students.roll_number",
            firstName: "students.first_name",
            lastName: "students.last_name",
            email: "students.email",
            createdAt: "students.created_at"
        };

        const sortColumn = ALLOWED_SORT_COLUMNS[sortBy] || "students.roll_number";
        const sortOrder = order && order.toString().toUpperCase() === "DESC" ? "DESC" : "ASC";

        const query = `
        SELECT
            students.id,
            students.roll_number,
            students.first_name || ' ' || students.last_name AS name,
            students.email,
            departments.name AS department
        FROM students
        INNER JOIN departments
        ON students.department_id = departments.id
        WHERE
            ($3::integer IS NULL OR students.department_id = $3::integer)
            AND
            (
                $4::text IS NULL
                OR students.first_name || ' ' || students.last_name ILIKE '%' || $4::text || '%'
                OR students.email ILIKE '%' || $4::text || '%'
            )
        ORDER BY ${sortColumn} ${sortOrder}
        LIMIT $1
        OFFSET $2
    `;

        const result = await pool.query(
            query,
            [limit, offset, departmentId, search]
        );

        return result.rows;
    }

    async countAll(departmentId, search) {
        const query = `
            SELECT COUNT(*)
            FROM students
            INNER JOIN departments
            ON students.department_id = departments.id
            WHERE
                ($1::integer IS NULL OR students.department_id = $1::integer)
                AND
                (
                    $2::text IS NULL
                    OR students.first_name || ' ' || students.last_name ILIKE '%' || $2::text || '%'
                    OR students.email ILIKE '%' || $2::text || '%'
                )
        `;

        const result = await pool.query(
            query,
            [departmentId, search]
        );

        return parseInt(result.rows[0].count, 10);
    }

    async findById(id) {
        const query = `
            SELECT
                students.id,
                students.roll_number,
                students.first_name || ' ' || students.last_name AS name,
                students.email,
                departments.name AS department
            FROM students
            INNER JOIN departments
            ON students.department_id = departments.id
            WHERE students.id = $1;    
        `;

        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async findByRollNumber(rollNumber) {
        const query = `
            SELECT *
            FROM students
            WHERE roll_number = $1;
        `;

        const result = await pool.query(query, [rollNumber]);

        return result.rows[0];
    }

    async findByEmail(email) {
        const query = `
            SELECT *
            FROM students
            WHERE email = $1;
        
        `;

        const result = await pool.query(query, [email]);

        return result.rows[0];
    }

    async create(
        rollnumber,
        firstname,
        lastname,
        email,
        phoneNumber,
        departmentId
    ) {

        const query = `
            INSERT INTO students (
                roll_number,
                first_name,
                last_name,
                email,
                phone_number,
                department_id     
            
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING
                id,
                roll_number,
                first_name,
                email,
                phone_number,
                department_id;      
        `;

        const result = await pool.query(query, [
            rollnumber,
            firstname,
            lastname,
            email,
            phoneNumber,
            departmentId
        ]);
        return result.rows[0];

    }

    async findByRollNumberExceptId(rollNumber, id) {
        const query = `
            SELECT *
            FROM students
            WHERE roll_number = $1
            AND id != $2;    
           

        `;

        const result = await pool.query(query, [rollNumber, id]);

        return result.rows[0];
    }

    async findByEmailExceptId(email, id) {
        const query = `
            SELECT *
            FROM students
            WHERE email = $1
            AND id != $2;
         `;

        const result = await pool.query(query, [email, id]);

        return result.rows[0];
    }

    async update(
        id,
        rollNumber,
        firstName,
        lastName,
        email,
        phoneNumber,
        departmentId
    ) {

        const query = `
        UPDATE students
        SET
            roll_number = $2,
            first_name = $3,
            last_name = $4,
            email = $5,
            phone_number = $6,
            department_id = $7,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING
            id,
            roll_number,
            first_name,
            last_name,
            email,
            phone_number,
            department_id;
    `;

        const result = await pool.query(query, [
            id,
            rollNumber,
            firstName,
            lastName,
            email,
            phoneNumber,
            departmentId
        ]);

        return result.rows[0];
    }

    async delete(id) {
        const query = `
            DELETE FROM students
            WHERE ID = $1
            RETURNING
               id,
               roll_number,
               first_name,
               last_name,
               email,
               phone_number,
               department_id;    
        `;

        const result = await pool.query(query, [id]);

        return result.rows[0];
    }

}

export default new StudentRepository();