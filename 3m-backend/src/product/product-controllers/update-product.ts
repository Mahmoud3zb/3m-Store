import { RequestHandler } from "express";
import { Product } from "../product-model";
import mongoose from "mongoose";

interface IRequest {
    name?: string;
    description?: string;
    imageCover?: string;
    price?: number;
    brand?: string;
    processor?: string;
    ram?: string;
    storage?: string;
    gpu?: string;
    screen?: string;
    grade?: string;
    battery?: string;
    warranty?: string;
    stockQuantity?: number;
    isFeatured?: boolean;
    categoryID?: string;
}

interface IResponse {
    message: string;
    data?: any;
}

export const updateProduct: RequestHandler<{ id: string }, IResponse, IRequest> = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid product id format" });
        }

        const updateData: Record<string, any> = { ...req.body };

        if (req.file?.path) {
            updateData.imageCover = req.file.path;
        }

        if (updateData.price) updateData.price = Number(updateData.price);
        if (updateData.stockQuantity) updateData.stockQuantity = Number(updateData.stockQuantity);

        if (updateData.offer === "") {
            updateData.offer = null;
        } else if (updateData.offer && typeof updateData.offer === "string") {
            try {
                updateData.offer = JSON.parse(updateData.offer);
            } catch {
                return res.status(400).json({ message: "Invalid offer format. Must be a valid JSON object." });
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate("categoryID", "name")
            .lean();

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};