import pool from "../config/db.js";

class StudentRepository {

    async findAll() {

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
            ORDER BY students.roll_number;

        `;

        const result = await pool.query(query);

        return result.rows;
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

        const result =  await pool.query(query, [id]);
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

}

export default new StudentRepository();