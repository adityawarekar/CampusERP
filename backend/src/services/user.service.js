import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";

class UserService {
    async registerUser(
        email,
        password,
        
    ) {
        const existingUser = 
          await userRepository.findByEmail(
            email
          );

        if (existingUser) {
            throw new Error(
                "User already exists"
            );
        }
        
        if (!email) {
            throw new Error(
                "Email is required"
            );
        }

        if (!password) {
            throw new Error(
                "Password must be at least 6 characters"
            );
        }

        const hashedPassword = 
           await bcrypt.hash(
            password,
            10
           );
        
        return await userRepository.createUser(
            email,
            hashedPassword,
            "STUDENT"
        );   
    }


    async loginuser(
        email,
        password
    ) {
        const user = 
           await userRepository.findByEmail(
            email
           );

        if (!user) {
            throw new Error(
                "Invalid email or password"
            );
        }   

        const isPasswordValid = 
           await bcrypt.compare(
            password,
            user.password
           );

        if (!isPasswordValid) {
            throw new Error(
                "Invalid email or password"
            );
        }
        
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token
        };
    };

    async getCurrentUser(userId) {
        const user = 
           await userRepository.findById(userId);
        
        if (!user) {
            throw new Error(
                "User not found"
            );
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role
        };   
    }

}

export default new UserService();