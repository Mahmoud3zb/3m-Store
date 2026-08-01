// for admin
import { RequestHandler } from "express";
import { IUser, User } from "../user-model";
import bcrypt from "bcrypt";

interface IAddress {
    street: string;
    city: string;
    country: string;
}

interface IRequest {
    name: string,
    email: string,
    password: string,
    address: IAddress
}
interface IResponse {
    message: string,
    data?: any
}
export const addUser: RequestHandler<{}, IResponse, any> = async (req, res) => {
    try {
        const { role, permissions, email } = req.body;
        const isAr = (req.headers["accept-language"] || "").toString().includes("ar");

        if (role === "admin" && email !== "admin@gmail.com" && (!permissions || !Array.isArray(permissions) || permissions.length === 0)) {
            return res.status(400).json({
                message: isAr ? "يرجى تحديد صلاحية واحدة على الأقل للأدمن" : "Admin user must have at least one permission assigned"
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            ...req.body,
            password: hashedPassword
        });
        const userObj = user.toObject();
        const { password: _, ...resUser } = userObj;
        return res.status(201).json({   
            message: "User created successfully",
            data: resUser
        });
    } catch (error) {
        if ((error as any).code === 11000) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};