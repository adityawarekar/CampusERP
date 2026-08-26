import hostelAllocationRepository from "../repositories/hostelAllocation.repository.js";

class HostelAllocationService {
    async createAllocation(
        studentId,
        roomId,
        bedNumber
    ) {
        const student =
            await hostelAllocationRepository
                .findStudentById(studentId);

        if (!student) {
            throw new Error(
                "Student not found"
            );
        }

        const room =
            await hostelAllocationRepository
                .findRoomById(roomId);

        if (!room) {
            throw new Error(
                "Room not found"
            );
        }

        if (!bedNumber) {
            throw new Error(
                "Bed number is required"
            );
        }

        if (bedNumber > room.capacity) {
            throw new Error(
                "Invalid bed number"
            );
        }

        if (
            room.occupied_beds >=
            room.capacity
        ) {
            throw new Error(
                "Room is full"
            );
        }

        const existingAllocation =
            await hostelAllocationRepository
                .findActiveAllocationByStudentId(
                    studentId
                );

        if (existingAllocation) {
            throw new Error(
                "Student already has an active hostel allocation"
            );
        }

        const existingBed =
            await hostelAllocationRepository
                .findActiveAllocationByRoomAndBed(
                    roomId,
                    bedNumber
                );

        if (existingBed) {
            throw new Error(
                "Bed is already occupied"
            );
        }



        return await hostelAllocationRepository
            .createAllocation(
                studentId,
                roomId,
                bedNumber
            );
    }

    async getAllAllocations() {
        return await hostelAllocationRepository
            .findAll();
    }

    async getAllAllocationById(id) {

        console.log("1️⃣ Service started:", id);
        const allocation =
            await hostelAllocationRepository.findById(id);

        console.log(
            "2️⃣ Repository returned:",
            allocation
        );
        if (!allocation) {
            throw new Error(
                "Hostel allocation not found"
            );
        }
        return allocation;
    }

    async vacatedAllocation(id) {
        return await hostelAllocationRepository
            .vacateAllocation(id);
    }

    async getAllocationsByStudentId(studentId) {

        const student =
            await hostelAllocationRepository
                .findStudentById(studentId);

        if (!student) {
            throw new Error(
                "Student not found"
            );
        }

        return await hostelAllocationRepository
            .findByStudentId(studentId);
    }

    async getActiveAllocation() {
        return await hostelAllocationRepository
            .findActive();
    }

}

export default new HostelAllocationService();