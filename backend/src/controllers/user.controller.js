import userService from "../services/user.service.js";

class UserController {
    async registerUser(req, res) {
        try {
            const {
                email,
                password,


            } = req.body;

            const user =
                await userService.registerUser(
                    email,
                    password,

                );

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: user
            });
        } catch (error) {
            if (
                error.message ===
                "User alreday exists"
            ) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }
            if (
                error.message ===
                "Email is required" ||

                error.message ===
                "Password is required" ||

                error.message ===
                "Password must be at least characters"
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

    async loginUser(req, res) {
        try {
            const {
                email,
                password
            } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required"
                });
            }
            const user =
                await userService.loginuser(
                    email,
                    password
                );

            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: user
            });
        } catch (error) {
            if (
                error.message ===
                "Invalid email or password"
            ) {
                return res.status(401).json({
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

    async getCurrentUser(req, res) {

        try {

            const currentUser =
                await userService.getCurrentUser(
                    req.user.id
                );

            return res.status(200).json({
                success: true,
                message: "Current user fetched successfully",
                data: currentUser
            });

        } catch (error) {

            if (error.message === "User not found") {
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
export default new UserController();