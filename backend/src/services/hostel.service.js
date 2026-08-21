import hostelRepository from "../repositories/hostel.repository.js";

class HostelService {
    async getAllHostels() {
        return await hostelRepository.findAll();
    }

    async getHostelById(id) {
        const hostel =
            await hostelRepository.findById(id);

        if (!hostel) {
            throw new Error("Hostel not found");
        }

        return hostel;
    }

    async createHostel(
        name,
        location,
        totalRooms
    ) {

        if (!name) {
            throw new Error("Hostel name is required");
        }

        if (totalRooms <= 0) {
            throw new Error(
                "Total rooms must be greater than zero"
            );
        }

        return await hostelRepository.create(
            name,
            location,
            totalRooms
        );
    }

    async updateHostel(
        id,
        name,
        location,
        totalRooms
    ) {
        if (!name) {
            throw new Error(
                "Hostel name is required"
            );
        }

        if (totalRooms <= 0) {
            throw new Error(
                "Total rooms must be greater than zero"
            );
        }
        const hostel = 
           await hostelRepository.update(
            id,
            name,
            location,
            totalRooms
           );
        if (!hostel) {
            throw new Error(
                "Hostel not found"
            );
        }
        return hostel;   
    }

    async deleteHostel(id) {
        const hostel = 
           await hostelRepository.delete(id);
        
        if(!hostel) {
            throw new Error(
                "Hostel not found"
            );

        }
        return hostel;   
    }
}

export default new HostelService();