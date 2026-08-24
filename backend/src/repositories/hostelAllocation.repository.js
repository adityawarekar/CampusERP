import pool from "../config/db.js";

class HostelAllocationRepository {
    async findStudentById(studentId) {
        const query = `
            SELECT
                Id,
                roll_number,
                first_name,
                last_name
            FROM students
            WHERE id = $1;    
        `;

        const result = await pool.query(
            query,
            [studentId]
        );

        return result.rows[0];
    }

    async findRoomById(roomId) {
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
            [roomId]
        );
        return result.rows[0];
    }

    async findActiveAllocationByStudentId(studentId) {
        const query = `
           SELECT
               id,
               student_id,
               room_id,
               bed_number,
               allocation_date,
               status
            FROM hostel_allocations
            WHERE student_id = $1
            AND status = 'Active';

        `;
        const result = await pool.query(
            query,
            [studentId]
        );

        return result.rows[0];
    }

    async createAllocation(
        studentId,
        roomId,
        bedNumber
    ) {

        const client = await pool.connect();

        try {

            await client.query("BEGIN");

            
            const roomResult = await client.query(
                `
            SELECT
                id,
                capacity,
                occupied_beds
            FROM rooms
            WHERE id = $1
            FOR UPDATE;
            `,
                [roomId]
            );

            if (roomResult.rows.length === 0) {
                throw new Error("Room not found");
            }

            const room = roomResult.rows[0];

            
            if (
                room.occupied_beds >=
                room.capacity
            ) {
                throw new Error("Room is full");
            }

            
            const allocationResult =
                await client.query(
                    `
                INSERT INTO hostel_allocations (
                    student_id,
                    room_id,
                    bed_number
                )
                VALUES ($1, $2, $3)
                RETURNING
                    id,
                    student_id,
                    room_id,
                    bed_number,
                    allocation_date,
                    vacated_date,
                    status;
                `,
                    [
                        studentId,
                        roomId,
                        bedNumber
                    ]
                );

            
            await client.query(
                `
            UPDATE rooms
            SET
                occupied_beds =
                    occupied_beds + 1,
                updated_at =
                    CURRENT_TIMESTAMP
            WHERE id = $1;
            `,
                [roomId]
            );

            
            await client.query("COMMIT");

            return allocationResult.rows[0];

        } catch (error) {

            await client.query("ROLLBACK");

            throw error;

        } finally {

            client.release();
        }
    }

    async findActiveAllocationByRoomAndBed(
        roomId,
        bedNumber
    ) {
        const query = `
           SELECT
               id,
               student_id,
               room_id,
               bed_number,
               status
            FROM hostel_allocations
            WHERE room_id = $1
            AND bed_number = $2
            AND status = 'Active';  
        `;

        const result = await pool.query(
            query,
            [
                roomId,
                bedNumber
            ]
        );

        return result.rows[0];
    }


}

export default new HostelAllocationRepository();