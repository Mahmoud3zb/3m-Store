import { RequestHandler } from "express";
import mongoose from "mongoose";
import { Order } from "../order-model";

interface IReportIssueRequest {
    reason: string;
    details?: string;
}

interface IResponse {
    message: string;
    data?: any;
}

export const reportOrderIssue: RequestHandler<{ id: string }, IResponse, IReportIssueRequest> = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason, details } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Order ID format" });
        }

        if (!reason || reason.trim() === "") {
            return res.status(400).json({ message: "Issue reason is required" });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Verify that the order belongs to the logged-in customer or user is admin
        if (order.userID.toString() !== req.user?.id && req.user?.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: You can only report issues for your own orders" });
        }

        order.status = "issue_reported";
        order.issueReport = {
            reason: reason.trim(),
            details: details ? details.trim() : "",
            reportedAt: new Date(),
            status: "open"
        };

        await order.save();

        return res.status(200).json({
            message: "Order issue reported successfully. Support team has been notified.",
            data: order
        });
    } catch (error) {
        console.error("Report Order Issue Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
