import studentRepository from "../repositories/student.repository.js";

class StudentService {

    async getAllStudents() {
        return await studentRepository.findAll();
    }

}

export default new StudentService();