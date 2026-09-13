import pool from "../config/db.js";

class RoomRepository {
    async findAll(
        limit,
        offset,
        hostelId,
        search,
        sortBy,
        order
    ) {
        const ALLOWED_SORT_COLUMNS = {
            id: "rooms.id",
            roomNumber: "rooms.room_number",
            capacity: "rooms.capacity",
            occupiedBeds: "rooms.occupied_beds"
        };

        const sortColumn = ALLOWED_SORT_COLUMNS[sortBy] || "rooms.id";
        const sortOrder = order && order.toString().toUpperCase() === "DESC" ? "DESC" : "ASC";

        const query = `
        SELECT
            rooms.id,
            rooms.hostel_id,
            hostels.name AS hostel_name,
            rooms.room_number,
            rooms.capacity,
            rooms.occupied_beds,
            rooms.created_at,
            rooms.updated_at
        FROM rooms

        INNER JOIN hostels
            ON rooms.hostel_id = hostels.id

        WHERE
            (
                $3::integer IS NULL
                OR rooms.hostel_id = $3::integer
            )

            AND

            (
                $4::text IS NULL
                OR rooms.room_number ILIKE '%' || $4::text || '%'
                OR hostels.name ILIKE '%' || $4::text || '%'
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
                hostelId,
                search
            ]
        );

        return result.rows;
    }

    async countAll(hostelId, search) {
        const query = `
            SELECT COUNT(*)
            FROM rooms
            INNER JOIN hostels
                ON rooms.hostel_id = hostels.id
            WHERE
                (
                    $1::integer IS NULL
                    OR rooms.hostel_id = $1::integer
                )
                AND
                (
                    $2::text IS NULL
                    OR rooms.room_number ILIKE '%' || $2::text || '%'
                    OR hostels.name ILIKE '%' || $2::text || '%'
                )
        `;

        const result = await pool.query(
            query,
            [hostelId, search]
        );

        return parseInt(result.rows[0].count, 10);
    }

    async findById(id) {
        const query = `
           SELECT
                rooms.id,
                rooms.hostel_id,
                hostels.name AS hostel_name,
                hostels.location AS hostel_location,
                rooms.room_number,
                rooms.capacity,
                rooms.occupied_beds,
                rooms.created_at,
                rooms.updated_at
            FROM rooms
            
            INNER JOIN hostels
                ON rooms.hostel_id = hostels.id
            
            WHERE rooms.id = $1;    
        `;

        const result = await pool.query(
            query,
            [id]
        );
        return result.rows[0]
    }

    async findHostelById(hostelId) {
        const query = `
           SELECT
               id,
               name
           FROM hostels
           WHERE id = $1;      
        `;

        const result = await pool.query(
            query,
            [hostelId]
        );

        return result.rows[0];
    }

    async create(
        hostelId,
        roomNumber,
        capacity
    ) {
        const query = `
           INSERT INTO rooms (
                hostel_id,
                room_number,
                capacity
           )
           VALUES ($1, $2, $3)
           RETURNING
                id,
                hostel_id,
                room_number,
                capacity,
                occupied_beds,
                created_at,
                updated_at;

         `;

        const result = await pool.query(
            query,
            [
                hostelId,
                roomNumber,
                capacity
            ]
        );

        return result.rows[0];
    }

    async findByHostelAndRoomNumber(
        hostelId,
        roomNumber
    ) {

        const query = `
        SELECT
            id,
            room_number
        FROM rooms
        WHERE hostel_id = $1
        AND room_number = $2;
    `;

        const result = await pool.query(
            query,
            [
                hostelId,
                roomNumber
            ]
        );

        return result.rows[0];
    }

    async findForUpdate(id) {
        const query = `
           SELECT
                id,
                hostel_id,
                room_number,
                capacity,
                occupied_beds
            FROM rooms
            WHERE id = $1;    
        `;

        const result = await pool.query(
            query,
            [id]
        );

        return result.rows[0];
    }

    async update(
        id,
        roomNumber,
        capacity
    ) {

        const query = `
        UPDATE rooms
        SET
            room_number = $2,
            capacity = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING
            id,
            hostel_id,
            room_number,
            capacity,
            occupied_beds,
            created_at,
            updated_at;
    `;

        const result = await pool.query(
            query,
            [
                id,
                roomNumber,
                capacity
            ]
        );

        return result.rows[0];
    }

    async findDuplicateRoom(
        id,
        hostelId,
        roomNumber
    ) {
        const query = `
            SELECT
                 id,
                 room_number
            FROM rooms
            WHERE hostel_id = $1
            AND room_number = $2
            AND id != $3;

        `;

        const result = await pool.query(
            query,
            [
                hostelId,
                roomNumber,
                id
            ]
        );

        return result.rows[0];
    }


    async delete(id) {
        const query = `
           DELETE FROM rooms
           WHERE id = $1
           RETURNING
                id,
                hostel_id,
                room_number,
                capacity,
                occupied_beds;
        `;

        const result = await pool.query(
            query,
            [id]
        );

        return result.rows[0];
    }
    async findAvailability() {

        const query = `
        SELECT
            rooms.id,
            rooms.hostel_id,
            hostels.name AS hostel_name,
            hostels.location AS hostel_location,

            rooms.room_number,
            rooms.capacity,
            rooms.occupied_beds,

            rooms.capacity - rooms.occupied_beds
                AS available_beds

        FROM rooms

        INNER JOIN hostels
            ON rooms.hostel_id = hostels.id

        ORDER BY
            hostels.name,
            rooms.room_number;
    `;

        const result = await pool.query(query);

        return result.rows;
    }


}

export default new RoomRepository();