import courseRepository from "../repositories/course.repository.js";

class CourseService {

    async getAllCourses() {

        return await courseRepository.findAll();

    }

    async getCourseById(id) {

        const course = await courseRepository.findById(id);

        if (!course) {
            throw new Error("Course not found");
        }

        return course;
    }

    async createCourse(name, code, credits) {
        const existingCourse =
            await courseRepository.findByCode(code);

        if (existingCourse) {
            throw new Error("Course code already exists");
        }

        return await courseRepository.create(
            name,
            code,
            credits
        );
    }

    async updateCourse(id, name, code, credits) {

        const course =
            await courseRepository.findById(id);

        if (!course) {
            throw new Error("Course not found");
        }

        const existingCourse =
            await courseRepository.findByCodeExceptId(code, id);

        if (existingCourse) {
            throw new Error("Course code already exists");
        }

        return await courseRepository.update(
            id,
            name,
            code,
            credits
        );
    }

    async deleteCourse(id) {
        const course = 
           await courseRepository.findById(id);
        
        if (!course) {
            throw new Error("Course not found");
        }
        
        return await courseRepository.delete(id);
    }



}

export default new CourseService();