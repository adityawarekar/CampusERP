import pool from "../config/db.js";

class RoomRepository {
    async findAll() {
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

            ORDER BY rooms.id;   
            
        `;
        const result = await pool.query(query);
        return result.rows;
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