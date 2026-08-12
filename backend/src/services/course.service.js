import courseRepository from "../repositories/course.repository.js";

class CourseService {

    async getAllCourses() {

        return await courseRepository.findAll();

    }

}

export default new CourseService();