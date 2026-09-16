import pool from "../config/db.js";

class HostelAllocationRepository {
    async findStudentById(studentId) {
        const query = `
            SELECT
                id,
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

    async findAll(
        limit,
        offset,
        studentId,
        roomId,
        status,
        search,
        sortBy,
        order
    ) {
        const ALLOWED_SORT_COLUMNS = {
            id: "hostel_allocations.id",
            allocationDate: "hostel_allocations.allocation_date",
            status: "hostel_allocations.status",
            studentName: "students.first_name"
        };

        // Note: sortBy and order are not wired to query params yet;
        // defaults are applied at the repository level for safety.
        // The service/controller can add them later when needed.
        const sortColumn =
            ALLOWED_SORT_COLUMNS[sortBy] ||
            "hostel_allocations.id";

        const sortOrder =
            order &&
                order.toString().toUpperCase() === "DESC"
                ? "DESC"
                : "ASC";

        const query = `
        SELECT
            hostel_allocations.id,

            hostel_allocations.student_id,
            students.roll_number,
            students.first_name || ' ' ||
            students.last_name AS student_name,

            hostel_allocations.room_id,
            rooms.room_number,

            rooms.hostel_id,
            hostels.name AS hostel_name,

            hostel_allocations.bed_number,
            hostel_allocations.allocation_date,
            hostel_allocations.vacated_date,
            hostel_allocations.status

        FROM hostel_allocations

        INNER JOIN students
            ON hostel_allocations.student_id =
               students.id

        INNER JOIN rooms
            ON hostel_allocations.room_id =
               rooms.id

        INNER JOIN hostels
            ON rooms.hostel_id =
               hostels.id

        WHERE
            (
                $3::integer IS NULL
                OR hostel_allocations.student_id =
                   $3::integer
            )

            AND

            (
                $4::integer IS NULL
                OR hostel_allocations.room_id =
                   $4::integer
            )

            AND

            (
                $5::text IS NULL
                OR hostel_allocations.status =
                   $5::text
            )

            AND

            (
                $6::text IS NULL

                OR students.first_name || ' ' ||
                   students.last_name
                   ILIKE '%' || $6::text || '%'

                OR rooms.room_number
                   ILIKE '%' || $6::text || '%'

                OR hostels.name
                   ILIKE '%' || $6::text || '%'
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
                studentId,
                roomId,
                status,
                search
            ]
        );

        return result.rows;
    }



    async countAll(studentId, roomId, status, search) {
        const query = `

            SELECT COUNT(*)
            FROM hostel_allocations
            INNER JOIN students
                ON hostel_allocations.student_id = students.id
            INNER JOIN rooms
                ON hostel_allocations.room_id = rooms.id
            INNER JOIN hostels
                ON rooms.hostel_id = hostels.id
            WHERE
                (
                    $1::integer IS NULL
                    OR hostel_allocations.student_id = $1::integer
                )
                AND
                (
                    $2::integer IS NULL
                    OR hostel_allocations.room_id = $2::integer
                )
                AND
                (
                    $3::text IS NULL
                    OR hostel_allocations.status = $3::text
                )
                AND
                (
                    $4::text IS NULL
                    OR students.first_name || ' ' || students.last_name
                       ILIKE '%' || $4::text || '%'
                    OR rooms.room_number
                       ILIKE '%' || $4::text || '%'
                    OR hostels.name
                       ILIKE '%' || $4::text || '%'
                )
        `;

        const result = await pool.query(
            query,
            [
                studentId,
                roomId,
                status,
                search
            ]
        );

        return parseInt(result.rows[0].count, 10);
    }

    async findById(id) {

        const query = `
        SELECT
            hostel_allocations.id,

            hostel_allocations.student_id,
            students.roll_number,
            students.first_name || ' ' ||
            students.last_name AS student_name,

            hostel_allocations.room_id,
            rooms.room_number,

            rooms.hostel_id,
            hostels.name AS hostel_name,
            hostels.location AS hostel_location,

            hostel_allocations.bed_number,
            hostel_allocations.allocation_date,
            hostel_allocations.vacated_date,
            hostel_allocations.status

        FROM hostel_allocations

        INNER JOIN students
            ON hostel_allocations.student_id = students.id

        INNER JOIN rooms
            ON hostel_allocations.room_id = rooms.id

        INNER JOIN hostels
            ON rooms.hostel_id = hostels.id

        WHERE hostel_allocations.id = $1;
    `;

        const result = await pool.query(
            query,
            [id]
        );

        return result.rows[0];
    }

    async vacateAllocation(allocationId) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const allocationResult =
                await client.query(
                    `
                SELECT
                    id,
                    room_id,
                    status
                FROM Hostel_allocations
                WHERE id = $1
                FOR UPDATE;    
                
                `,
                    [allocationId]
                );
            if (allocationResult.rows.length === 0) {
                throw new Error(
                    "Hostel allocation not found"
                );
            }

            const allocation =
                allocationResult.rows[0];

            if (allocation.status === "Vacated") {
                throw new Error(
                    "Student has already been vacated"
                );
            }

            const updateResult =
                await client.query(
                    `
                UPDATE hostel_allocations
                SET
                   vacated_date = CURRENT_DATE,
                   status = 'Vacated',
                   updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
                RETURNING
                    id,
                    student_id,
                    room_id,
                    bed_number,
                    allocation_date,
                    vacated_date,
                    status;   
                `,
                    [allocationId]
                );

            await client.query(
                `
                UPDATE rooms
                SET
                   occupied_beds = 
                      occupied_beds - 1,
                   updated_at = CURRENT_TIMESTAMP
                WHERE id = $1;     
                `,
                [allocation.room_id]
            );

            await client.query("COMMIT");

            return updateResult.rows[0];

        } catch (error) {
            await client.query("ROLLBACK");

            throw error;
        } finally {
            client.release();
        }
    }


    async findByStudentId(studentId) {

        const query = `
        SELECT
            hostel_allocations.id,

            hostel_allocations.student_id,
            students.roll_number,
            students.first_name || ' ' ||
            students.last_name AS student_name,

            hostel_allocations.room_id,
            rooms.room_number,

            rooms.hostel_id,
            hostels.name AS hostel_name,
            hostels.location AS hostel_location,

            hostel_allocations.bed_number,
            hostel_allocations.allocation_date,
            hostel_allocations.vacated_date,
            hostel_allocations.status

        FROM hostel_allocations

        INNER JOIN students
            ON hostel_allocations.student_id =
               students.id

        INNER JOIN rooms
            ON hostel_allocations.room_id =
               rooms.id

        INNER JOIN hostels
            ON rooms.hostel_id =
               hostels.id

        WHERE hostel_allocations.student_id = $1

        ORDER BY hostel_allocations.allocation_date DESC;
    `;

        const result = await pool.query(
            query,
            [studentId]
        );

        return result.rows;
    }

    async findActive() {
        const query = `
          SELECT
               hostel_allocations.id,
               hostel_allocations.student_id,
               students.roll_number,
               students.first_name || ' ' ||
               students.last_name AS student_name,
               
               hostel_allocations.room_id,
               rooms.room_number,

               rooms.hostel_id,
               hostels.name AS hostel_name,
               hostels.location AS hostel_location,

               hostel_allocations.bed_number,
               hostel_allocations.allocation_date,
               hostel_allocations.status

            FROM hostel_allocations
            
            INNER JOIN students
               ON hostel_allocations.student_id = 
                 students.id
            
            INNER JOIN rooms
               ON hostel_allocations.room_id =
                  rooms.id
            
            INNER JOIN hostels
               ON rooms.hostel_id = 
                 hostels.id
                 
            WHERE hostel_allocations.status = 'Active'
            
            ORDER BY
                 hostels.name,
                 rooms.room_number,
                 hostel_allocations.bed_number;
        `;

        const result = await pool.query(query);
        return result.rows;
    }




}

export default new HostelAllocationRepository();