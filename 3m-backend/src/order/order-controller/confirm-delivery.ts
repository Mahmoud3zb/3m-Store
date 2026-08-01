import { RequestHandler } from "express";
import mongoose from "mongoose";
import { Order } from "../order-model";

interface IResponse {
    message: string;
    data?: any;
}

export const confirmDelivery: RequestHandler<{ id: string }, IResponse> = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Order ID format" });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Verify that the order belongs to the logged-in customer or user is admin
        if (order.userID.toString() !== req.user?.id && req.user?.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: You can only confirm delivery for your own orders" });
        }

        if (order.status !== "shipped") {
            return res.status(400).json({ message: `Cannot confirm delivery for an order with status '${order.status}'. Order must be shipped first.` });
        }

        order.status = "delivered";
        order.deliveredAt = new Date();
        if (order.paymentMethod === "cash" && !order.isPaid) {
            order.isPaid = true;
            order.paidAt = new Date();
        }

        await order.save();

        return res.status(200).json({
            message: "Order delivery confirmed successfully",
            data: order
        });
    } catch (error) {
        console.error("Confirm Delivery Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
