import courseService from "../services/course.service.js";

class CourseController {

    async getAllCourses(req, res) {

        try {

            const courses =
                await courseService.getAllCourses();

            return res.status(200).json({
                success: true,
                message: "Courses fetched successfully",
                data: courses
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }

    async getCourseById(req, res) {

        try {

            const { id } = req.params;

            const course =
                await courseService.getCourseById(id);

            return res.status(200).json({
                success: true,
                data: course
            });

        } catch (error) {

            if (error.message === "Course not found") {
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

    async createCourse(req, res) {
        try {
            const {
                name,
                code,
                credits
            } = req.body;

            const course =
                await courseService.createCourse(
                    name,
                    code,
                    credits
                );
            return res.status(201).json({
                success: true,
                message: "Course created successfully",
                data: course
            });
        } catch (error) {
            if (error.message === "Course code alreday exists") {
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

    async updateCourse(req, res) {

        try {

            const { id } = req.params;

            const {
                name,
                code,
                credits
            } = req.body;

            const course =
                await courseService.updateCourse(
                    id,
                    name,
                    code,
                    credits
                );

            return res.status(200).json({
                success: true,
                message: "Course updated successfully",
                data: course
            });

        } catch (error) {

            if (
                error.message === "Course not found" ||
                error.message === "Course code already exists"
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

    async deleteCourse(req, res) {

        try {

            const { id } = req.params;

            const course =
                await courseService.deleteCourse(id);

            return res.status(200).json({
                success: true,
                message: "Course deleted successfully",
                data: course
            });

        } catch (error) {

            if (error.message === "Course not found") {
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

export default new CourseController();