import hostelService from "../services/hostel.service.js";

class HostelController {

    async getAllHostels(req, res) {

        try {

            const hostels =
                await hostelService.getAllHostels();

            return res.status(200).json({
                success: true,
                message: "Hostels fetched successfully",
                data: hostels
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }

    async getHostelById(req, res) {

        try {

            const { id } = req.params;

            const hostel =
                await hostelService.getHostelById(id);

            return res.status(200).json({
                success: true,
                data: hostel
            });

        } catch (error) {

            if (error.message === "Hostel not found") {

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

    async createHostel(req, res) {

        try {

            const {
                name,
                location,
                totalRooms
            } = req.body;

            const hostel =
                await hostelService.createHostel(
                    name,
                    location,
                    totalRooms
                );

            return res.status(201).json({
                success: true,
                message: "Hostel created successfully",
                data: hostel
            });

        } catch (error) {

            if (
                error.message ===
                "Hostel name is required" ||
                error.message ===
                "Total rooms must be greater than zero"
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

    async updateHostel(req, res) {
        try {
            const { id } = req.params;

            const {
                name,
                location,
                totalRooms
            } = req.body;

            const hostel = 
               await hostelService.updateHostel(
                  id,
                  name,
                  location,
                  totalRooms
               );
            return res.status(200).json({
                success: true,
                message: "Hostel updated succesfully",
                data: hostel
            });   
        } catch (error) {
            if (
                error.message === 
                "Hostel not found"
            ) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            if (
                error.message ===
                "Hostel name is required" ||
                error.message ===
                "TotaL rooms must be greater than zero"
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

    async deleteHostel(req, res) {
        try {
            const { id } = req.params;

            const hostel = 
               await hostelService.deleteHostel(id);

            return res.status(200).json({
                success: true,
                message: "Hostel deleted successfully",
                data: hostel
            });    
        } catch (error) {
            if (
                error.message ===
                "Hostel not found"
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



}

export default new HostelController();