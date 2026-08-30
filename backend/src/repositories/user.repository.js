import pool from "../config/db.js";

class UserRepository {

    async findByEmail(email) {

        const query = `
            SELECT
                id,
                email,
                password,
                role,
                created_at,
                updated_at
            FROM users
            WHERE email = $1;
        `;

        const result = await pool.query(
            query,
            [email]
        );

        return result.rows[0];
    }


    async createUser(
        email,
        password,
        role
    ) {

        const query = `
            INSERT INTO users (
                email,
                password,
                role
            )
            VALUES ($1, $2, $3)
            RETURNING
                id,
                email,
                role,
                created_at,
                updated_at;
        `;

        const result = await pool.query(
            query,
            [
                email,
                password,
                role
            ]
        );

        return result.rows[0];
    }

    async findById(id) {

        const query = `
        SELECT
            id,
            email,
            role,
            created_at,
            updated_at
        FROM users
        WHERE id = $1;
    `;

        const result = await pool.query(
            query,
            [id]
        );

        return result.rows[0];
    }

}

export default new UserRepository();