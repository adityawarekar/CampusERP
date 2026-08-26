import hostelAllocationService from "../services/hostelAllocation.service.js";

class HostleAllocationController {
    async createAllocation(req, res) {
        try {
            const {
                studentId,
                roomId,
                bedNumber
            } = req.body;

            const allocation =
                await hostelAllocationService
                    .createAllocation(
                        studentId,
                        roomId,
                        bedNumber
                    );
            return res.status(201).json({
                success: true,
                message: "Student allocated successfully",
                data: allocation
            });
        } catch (error) {
            if (
                error.message === "Student not found" ||
                error.message === "Room not found"
            ) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            if (
                error.message === "Bed number is required" ||
                error.message === "Invalid bed number" ||
                error.message === "Room is full" ||
                error.message === "Bed is already occupied" ||
                error.message ===
                "Student already has an active hostel allocation"
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }


    }

    async getAllAllocations(req, res) {
        try {
            const allocations =
                await hostelAllocationService
                    .getAllAllocations();

            return res.status(200).json({
                success: true,
                message:
                    "Hostel allocations fetched successfully",
                data: allocations
            });
        } catch (error) {
            return res.status(500).jso({
                success: false,
                message: error.message
            });
        }
    }

    async getAllAllocationById(req, res) {
        console.log("🔥 GET ALLOCATION BY ID HIT");
        try {
            const { id } = req.params;

            const allocation =
                await hostelAllocationService
                    .getAllAllocationById(id);

            return res.status(200).json({
                success: true,
                data: allocation
            });
        } catch (error) {
            if (
                error.message ===
                "Hostel allocation not found"
            ) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }

    async vacateAllocation(req, res) {
        try {
            const { id } = req.params;

            const allocation =
                await hostelAllocationService.vacatedAllocation(id);

            return res.status(200).josn({
                success: true,
                message:
                    "Student vacated successfully",
                data: allocation
            });
        } catch (error) {
            if (
                error.message ===
                "Hostel allocation not found"
            ) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message ===
                "Student has already been vacated"
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getAllocationsByStudentId(req, res) {

        try {

            const { studentId } = req.params;

            const allocations =
                await hostelAllocationService
                    .getAllocationsByStudentId(
                        studentId
                    );

            return res.status(200).json({
                success: true,
                message:
                    "Student hostel allocations fetched successfully",
                data: allocations
            });

        } catch (error) {

            if (
                error.message ===
                "Student not found"
            ) {

                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getActiveAllocations(req, res) {
        try {
            const allocations = 
               await hostelAllocationService
                  .getActiveAllocation();
               
            return res.status(200).json({
                success: true,
                message:
                "Active hostel allocations fetched successully",
                data: allocations
            });      
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new HostleAllocationController();