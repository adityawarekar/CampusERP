import departmentRepository from "../repositories/department.repository.js";

class DepartmentService {
    async getAllDepartments() {
        const departments = await departmentRepository.findAll();

        return departments;
    }

    async getDepartmentById(id) {
        return await departmentRepository.findById(id);
    }

}
export default new DepartmentService();