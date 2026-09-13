import pool from "../config/db.js";

class HostelRepository {
    async findAll(
        limit,
        offset,
        search,
        sortBy,
        order
    ) {
        const ALLOWED_SORT_COLUMNS = {
            id: "hostels.id",
            name: "hostels.name",
            location: "hostels.location",
            totalRooms: "hostels.total_rooms"
        };

        const sortColumn = ALLOWED_SORT_COLUMNS[sortBy] || "hostels.id";
        const sortOrder = order && order.toString().toUpperCase() === "DESC" ? "DESC" : "ASC";

        const query = `
        SELECT
            id,
            name,
            location,
            total_rooms,
            created_at,
            updated_at
        FROM hostels
        WHERE
            (
                $3::text IS NULL
                OR name ILIKE '%' || $3::text || '%'
                OR location ILIKE '%' || $3::text || '%'
            )
        ORDER BY ${sortColumn} ${sortOrder}
        LIMIT $1
        OFFSET $2;
    `;

    const result = await pool.query(
        query,
        [
            limit,
            offset,
            search
        ]
    );

    return result.rows;
}

    async countAll(search) {
        const query = `
            SELECT COUNT(*)
            FROM hostels
            WHERE
                (
                    $1::text IS NULL
                    OR name ILIKE '%' || $1::text || '%'
                    OR location ILIKE '%' || $1::text || '%'
                )
        `;

        const result = await pool.query(query, [search]);
        return parseInt(result.rows[0].count, 10);
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