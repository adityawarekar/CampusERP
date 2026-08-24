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
}

export default new HostleAllocationController();