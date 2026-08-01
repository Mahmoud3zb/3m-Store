import { RequestHandler } from "express";
import { IUser, User } from "../user-model";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface IRequest {
    name: string
}
interface IResponse {
    message: string,
    data?: IUser
}
export const updateUserNameById: RequestHandler<{ id: string }, IResponse, IRequest> = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid user id"
            });
        }

        // Non-admin users can only update their own profile name
        if (req.user?.role !== "admin" && req.user?.id !== req.params.id) {
            return res.status(403).json({ message: "Forbidden: You can only update your own profile" });
        }

        const updateFields: any = {};
        if (req.body.name) {
            updateFields.name = req.body.name;
        }

        // Check if admin is trying to modify administrative fields (role, permissions, password)
        const requestingUser = await User.findById(req.user?.id);
        const canManageUsers = requestingUser?.role === "admin" && 
            (requestingUser.email === "admin@gmail.com" || requestingUser.permissions.includes("can_manage_users" as any));

        if ((req.body as any).role || (req.body as any).permissions || (req.body as any).password) {
            if (!canManageUsers) {
                return res.status(403).json({ message: "Forbidden: You do not have permission to modify roles or permissions (can_manage_users required)" });
            }
            if ((req.body as any).role) {
                updateFields.role = (req.body as any).role;
            }
            if ((req.body as any).permissions) {
                updateFields.permissions = (req.body as any).permissions;
            }
            if ((req.body as any).password) {
                updateFields.password = await bcrypt.hash((req.body as any).password, 10);
            }
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true }).select("-password").lean();
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
