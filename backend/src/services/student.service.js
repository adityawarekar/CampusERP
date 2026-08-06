import departmentRepository from "../repositories/department.repository.js";
import studentRepository from "../repositories/student.repository.js";

class StudentService {

    async getAllStudents() {
        return await studentRepository.findAll();
    }

    async getStudentById(id) {
        const student = await studentRepository.findById(id);

        if(!student) {
            throw new Error("Student not found");
        }
        return student;
    }

    async createStudent(
        rollNumber,
        firstName,
        lastName,
        email,
        phoneNumber,
        departmentId
    ) {
        const department = 
           await departmentRepository.findById(departmentId);
           
        if (!department) {
            throw new Error("Department not found");
        }   

        const existingRollNumber =
            await studentRepository.findByRollNumber(rollNumber);
           
        if(existingRollNumber) {
            throw new Error("Roll number already exists");
        }    

        const existingEmail = 
            await studentRepository.findByEmail(email);
        
        if (existingEmail) {
            throw new Error("Email already exists");
        }

        // Create student
        return await studentRepository.create(
            rollNumber,
            firstName,
            lastName,
            email,
            phoneNumber,
            departmentId
        );
    }

    

}

export default new StudentService();