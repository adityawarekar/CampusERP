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
}

export default new CourseController();