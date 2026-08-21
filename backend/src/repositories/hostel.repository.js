import pool from "../config/db.js";

class HostelRepository {
    async findAll() {
        const query = `
            SELECT
                id,
                name,
                location,
                total_rooms,
                created_at,
                updated_at
            FROM hostels
            ORDER BY id;      
         `;

         const result = await pool.query(query);

         return result.rows;
    }

    async findById(id) {
        const query = `
           SELECT
               id,
               name,
               location,
               total_rooms,
               created_at,
               updated_at
            FROM hostels
            WHERE id = $1;   
        `;

        const result = await pool.query(
            query,
            [id]
        );
        return result.rows[0];
    }

    async create(
        name,
        location,
        totalRooms
    ) {
        const query = `
           INSERT INTO hostels (
           name,
           location,
           total_rooms
           )
           VALUES ($1, $2, $3)
           RETURNING
              id,
              name,
              location,
              total_rooms,
              created_at,
              updated_at;
        
        `;

        const result = await pool.query(
            query,
            [
                name,
                location,
                totalRooms
            ]
        );
        return result.rows[0];
    }

    async update(
        id,
        name,
        location,
        totalRooms
    ) {
        const query = `
            UPDATE hostels
            SET
               name = $2,
               location = $3,
               total_rooms = $4,
               updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING
                id,
                name,
                location,
                total_rooms,
                created_at,
                updated_at;   
        `;

        const  result = await pool.query(
            query,
            [
                id,
                name,
                location,
                totalRooms
            ]
        );
        return result.rows[0];
    }

    async delete(id) {
        const query = `
            DELETE FROM hostels
            WHERE id = $1
            RETURNING
                 id,
                 name,
                 location,
                 total_rooms;    
        `;
        const result = await pool.query(
            query,
            [id]
        );

        return result.rows[0];
    }

    
}


export default new HostelRepository();