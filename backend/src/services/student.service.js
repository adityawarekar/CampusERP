import departmentRepository from "../repositories/department.repository.js";
import studentRepository from "../repositories/student.repository.js";

class StudentService {
    async getAllStudents(
        page = 1,
        limit = 10,
        departmentId = null,
        search = null,
        sortBy = null,
        order = null
    ) {

        const offset = (page - 1) * limit;

        const [students, total] = await Promise.all([
            studentRepository.findAll(
                limit,
                offset,
                departmentId,
                search,
                sortBy,
                order
            ),
            studentRepository.countAll(
                departmentId,
                search
            )
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: students,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }

    async getStudentById(id) {
        const student = await studentRepository.findById(id);

        if (!student) {
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

        if (existingRollNumber) {
            throw new Error("Roll number already exists");
        }

        const existingEmail =
            await studentRepository.findByEmail(email);

        if (existingEmail) {
            throw new Error("Email already exists");
        }


        return await studentRepository.create(
            rollNumber,
            firstName,
            lastName,
            email,
            phoneNumber,
            departmentId
        );
    }

    async updateStudent(
        id,
        rollNumber,
        firstName,
        lastName,
        email,
        phoneNumber,
        departmentId
    ) {
        const student = await studentRepository.findById(id);

        if (!student) {
            throw new Error("Student not found");
        }

        const department = await departmentRepository.findById(departmentId);

        if (!department) {
            throw new Error("Department not found")
        }

        const existingRollNumber =
            await studentRepository.findByRollNumberExceptId(rollNumber, id);

        if (existingRollNumber) {
            throw new Error("Roll number already exists");
        }

        const existingEmail =
            await studentRepository.findByEmailExceptId(email, id);

        if (existingEmail) {
            throw new Error("Email already exists");
        }

        return await studentRepository.update(
            id,
            rollNumber,
            firstName,
            lastName,
            email,
            phoneNumber,
            departmentId
        );
    }

    async deleteStudents(id) {
        const student = await studentRepository.findById(id);

        if (!student) {
            throw new Error("Student not found");
        }

        return await studentRepository.delete(id);
    }



}

export default new StudentService();