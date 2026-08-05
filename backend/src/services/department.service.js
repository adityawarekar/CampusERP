import departmentRepository from "../repositories/department.repository.js";

class DepartmentService {
    async getAllDepartments() {
        return await departmentRepository.findAll();
    }

    async getDepartmentById(id) {
        return await departmentRepository.findById(id);
    }

    async createDepartment(name, code) {
        const existingDepartment = 
           await departmentRepository.findByCode(code);
        
        if (existingDepartment) {
            throw new Error("Department code already exists");
        }

        return await departmentRepository.create(name, code);
    }

    async updateDepartment(id, name, code) {
        const department = 
            await departmentRepository.findById(id);
        
        if (!department) {
            throw new Error("Department not found");
        }
        
        const existingDepartment = 
            await departmentRepository.findByCode(code);

        if (
            existingDepartment &&
            existingDepartment.id != id
        ) {
            throw new Error("Department code already exists");
        }
        
        return await departmentRepository.update(
            id,
            name,
            code
        );
    }

    async deleteDepartment(id) {

        const department = 
            await departmentRepository.findById(id);

            if (!department) {
                throw new Error("Department not found");
            }

            return await departmentRepository.delete(id);

    }


}
export default new DepartmentService();