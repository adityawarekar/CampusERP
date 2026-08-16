import feeRepository from "../repositories/fee.repository.js";

class FeeService {
    async getAllFees() {
        return await feeRepository.findAll();
    }

    async getFeeById(id) {
        const fee = await feeRepository.findById(id);

        if (!fee) {
            throw new Error("Fee record not found");
        }

        return fee;
    }

    async createFee(
        studentId,
        totalAmount,
        dueDate
    ) {

        

        const student =
            await feeRepository.findStudentById(studentId);

        

        if (!student) {
            throw new Error("Student not found");
        }

        if (totalAmount < 0) {
            throw new Error("Total amount cannot be negative");
        }

        const existingFee =
            await feeRepository.findByStudentId(studentId);

        if (existingFee) {
            throw new Error(
                "Fee record already exists for this student"
            );
        }

        return await feeRepository.create(
            studentId,
            totalAmount,
            dueDate
        );
    }

    async createPayment(
        feeId,
        amount,
        paymentMethod
    ) {
        if (amount <= 0) {
            throw new Error(
                "Payment amount must be greater than zero"
            );
        }

        if (!paymentMethod) {
            throw new Error(
                "Payment method is required"
            );
        }

        return await feeRepository.createPayment(
            feeId,
            amount,
            paymentMethod
        );
    }
}

export default new FeeService();