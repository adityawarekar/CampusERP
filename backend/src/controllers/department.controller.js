import departmentService from "../services/department.service.js";

class DepartmentController {
    async getAllDepartments(req, res) {
        try {
            const departments = await departmentService.getAllDepartments();

            return res.status(200).json({
                success: true,
                message: "Departments fetched successfully",
                data: departments,
            });
        }  catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async getDepartmentById(req, res) {
    try {
        const { id } = req.params;

        const department =
            await departmentService.getDepartmentById(id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: department
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

    async createDepartment(req, res) {
        try {
            const { name, code } = req.body;

            const  department = await departmentService.createDepartment(
                name,
                code
            );

            return res.status(201).json({
                success: true,
                message: "Department created successfully",
                data: department,
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    async updateDepartment(req, res) {
        try {
            const { id } = req.params;
            const { name, code } = req.body;

            const department = await departmentService.updateDepartment(
                id,
                name,
                code
            );

            return res.status(200).json({
                success: true,
                message: "Department updated successfully",
                data: department,
            });
        } catch (error) {
            if (
                error.message === "Department not found"
            ) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }

            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    async deleteDepartment(req, res) {
        try {
            const { id } = req.params;
            
            const department = 
                await departmentService.deleteDepartment(id);
            
            return res.status(200).json({
                success: true,
                message: "Department deleted successfully",
                data: department
            });    

        } catch (error) {
            if (error.message === "Department not found") {
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

export default new DepartmentController();