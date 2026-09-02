import feeService from "../services/fee.service.js";

class FeeController {
    async getAllFees(req, res) {
        try {
            const fees =
                await feeService.getAllFees();
            return res.status(200).json({
                success: true,
                message: "Fees fetched successfully",
                data: fees
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getFeeById(req, res) {

        try {

            const { id } = req.params;

            const fee =
                await feeService.getFeeById(id);

            return res.status(200).json({
                success: true,
                data: fee
            });

        } catch (error) {

            if (error.message === "Fee record not found") {

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

    async createFee(req, res) {

        try {

            const {
                studentId,
                totalAmount,
                dueDate
            } = req.body;

            const fee =
                await feeService.createFee(
                    studentId,
                    totalAmount,
                    dueDate
                );

            return res.status(201).json({
                success: true,
                message: "Fee record created successfully",
                data: fee
            });

        } catch (error) {

            if (error.message === "Student not found") {

                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message === "Total amount cannot be negative" ||
                error.message ===
                "Fee record already exists for this student"
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

    async createPayment(req, res) {
        try {
            const { feeId } = req.params;

            const {
                amount,
                paymentMethod
            } = req.body;

            const payment =
                await feeService.createPayment(
                    feeId,
                    amount,
                    paymentMethod
                );

            return res.status(201).json({
                success: true,
                message: "Payment created successfully",
                data: payment
            });
        } catch (error) {
            if (
                error.message ===
                "Fee record not found"
            ) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message ===
                "Payment amount must be greater than zero" ||
                error.message ===
                "Payment method is required" ||
                error.message ===
                "Payment exceeds remaining fee"
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

    async getPaymentsByFeeId(req, res) {

        try {

            const { feeId } = req.params;

            const payments =
                await feeService.getPaymentsByFeeId(feeId);

            return res.status(200).json({
                success: true,
                message: "Payments fetched successfully",
                data: payments
            });

        } catch (error) {

            if (error.message === "Fee record not found") {

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

    async updateFee(req, res) {

        try {

            const { id } = req.params;

            const {
                totalAmount,
                dueDate
            } = req.body;

            const fee =
                await feeService.updateFee(
                    id,
                    totalAmount,
                    dueDate
                );

            return res.status(200).json({
                success: true,
                message: "Fee updated successfully",
                data: fee
            });

        } catch (error) {

            if (error.message === "Fee record not found") {

                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message ===
                "Total amount cannot be less than amount already paid"
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

    async deleteFee(req, res) {

        try {

            const { id } = req.params;

            const fee =
                await feeService.deleteFee(id);

            return res.status(200).json({
                success: true,
                message: "Fee deleted successfully",
                data: fee
            });

        } catch (error) {

            if (error.message === "Fee record not found") {

                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message ===
                "Cannot delete fee record with existing payments"
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




}
export default new FeeController();