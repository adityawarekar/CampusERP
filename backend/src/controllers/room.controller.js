import roomService from "../services/room.service.js";

class RoomController {
    async getAllRooms(req, res) {
        try {
            const rooms =
                await roomService.getAllRooms();

            return res.status(200).json({
                success: true,
                message: "Rooms fetched successfully",
                data: rooms
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getRoomsById(req, res) {
        try {
            const { id } = req.params;

            const room =
                await roomService.getRoomById(id);

            return res.status(200).json({
                success: true,
                data: room
            });
        } catch (error) {
            if (error.message === "Room not found") {
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

    async createRoom(req, res) {
        try {
            const {
                hostelId,
                roomNumber,
                capacity
            } = req.body;

            const room =
                await roomService.createRoom(
                    hostelId,
                    roomNumber,
                    capacity
                );

            return res.status(201).json({
                success: true,
                message: "Room created successfully",
                data: room
            });
        } catch (error) {
            if (
                error.message === "Hostel not found") {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            if (
                error.message === "Room number is required" ||
                error.message === "Room capacity must be greater than zero"
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

    async updateRoom(req, res) {

        try {

            const { id } = req.params;

            const {
                roomNumber,
                capacity
            } = req.body;

            const room =
                await roomService.updateRoom(
                    id,
                    roomNumber,
                    capacity
                );

            return res.status(200).json({
                success: true,
                message: "Room updated successfully",
                data: room
            });

        } catch (error) {

            if (
                error.message ===
                "Room not found"
            ) {

                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message ===
                "Room number is required" ||

                error.message ===
                "Room capacity must be greater than zero" ||

                error.message ===
                "Capacity cannot be less than occupied beds"
            ) {

                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message ===
                "Room already exists in this hostel"
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

    async deleteRoom(req, res) {
        try {
            const { id } = req.params;

            const room = 
               await roomService.deleteRoom(id);

            return res.status(200).json({
                success: true,
                message: "Room deleted successfully",
                data: room
            }) ;  
        } catch (error) {
            if (
                error.message ===
                "Room not found"
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
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

    async getRoomAvailability(req, res) {
        try {
            const rooms = 
               await roomService.getRoomAvailability();
            
            return res.status(200).json({
                success: true,
                message: "Room availability fetched successfully",
                data: rooms
            });   
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


}


export default new RoomController();