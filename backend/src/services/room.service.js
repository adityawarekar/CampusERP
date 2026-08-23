import roomRepository from "../repositories/room.repository.js";

class RoomService {

    async getAllRooms() {

        return await roomRepository.findAll();

    }

    async getRoomById(id) {
        const room = 
           await roomRepository.findById(id);
        
        if (!room) {
            throw new Error("Room not found");
        }
        
        return room;
    }

    async createRoom(
        hostelId,
        roomNumber,
        capacity
    ) {
        const hostel = 
           await roomRepository.findHostelById(
            hostelId
           );
        if (!hostel) {
            throw new Error(
                "Hostel not found"
            );
        }
        
        if (!roomNumber) {
            throw new Error(
                "Room number is required"
            );
        }

        if(capacity <= 0) {
            throw new Error(
                "Room capacity must be graeter than zero"
            );
        }

        const existingRoom = 
            await roomRepository.findByHostelAndRoomNumber(
                hostelId,
                roomNumber
            );

        if (existingRoom) {
            throw new Error(
                "Room already exists in this hostel"
            );
        }    
         return await roomRepository.create(
        hostelId,
        roomNumber,
        capacity
    );


    }

    

    async updateRoom(
        id,
        roomNumber,
        capacity
    ) {
        const room = 
           await roomRepository.findForUpdate(id);

           if(!room) {
            throw new Error(
                "Room not found"
            );
           }

           if(!roomNumber) {
            throw new Error(
                "Room  number is required"
            );
           }

           if (capacity <= 0) {
            throw new Error(
                "Room capacity must be greater than zero"
            );   
           }

           if (capacity < room.occupied_beds) {
            throw new Error(
                "Capacity cannot be less than occupied beds"
            );
           }

           const duplicateRoom =
             await roomRepository.findDuplicateRoom(
                id,
                room.hostel_id,
                roomNumber
             );

           if (duplicateRoom) {
            throw new Error(
                "Room already exists in this hostel"
            );
           }

           return await roomRepository.update(
            id,
            roomNumber,
            capacity
           );
    }

    

}

export default new RoomService();