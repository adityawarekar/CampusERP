import hostelRepository from "../repositories/hostel.repository.js";

class HostelService {
    async getAllHostels(
        page = 1,
        limit = 10,
        search = null,
        sortBy = null,
        order = null
    ) {

        const offset = (page - 1) * limit;

        const [hostels, total] = await Promise.all([
            hostelRepository.findAll(
                limit,
                offset,
                search,
                sortBy,
                order
            ),
            hostelRepository.countAll(search)
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: hostels,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
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

        if (!hostel) {
            throw new Error(
                "Hostel not found"
            );

        }
        return hostel;
    }
}

export default new HostelService();