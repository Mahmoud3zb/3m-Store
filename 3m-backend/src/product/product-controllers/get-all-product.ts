import { RequestHandler } from "express";
import { Product } from "../product-model";
import mongoose from "mongoose";

export const getAllProducts: RequestHandler = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const filterObj: any = {};

        if (req.query.keyword) {
            const keywordRegex = { $regex: req.query.keyword as string, $options: "i" };
            filterObj.$or = [
                { name: keywordRegex },
                { brand: keywordRegex },
                { processor: keywordRegex },
                { description: keywordRegex },
                { gpu: keywordRegex }
            ];
        }

        if (req.query.brand) {
            filterObj.brand = { $regex: req.query.brand as string, $options: "i" };
        }

        if (req.query.processor) {
            filterObj.processor = { $regex: req.query.processor as string, $options: "i" };
        }

        if (req.query.grade) {
            filterObj.grade = { $regex: req.query.grade as string, $options: "i" };
        }

        if (req.query.isFeatured !== undefined) {
            filterObj.isFeatured = req.query.isFeatured === "true";
        }

        if (req.query.categoryID) {
            if (!mongoose.Types.ObjectId.isValid(req.query.categoryID as string)) {
                return res.status(400).json({ message: "Invalid category ID format" });
            }
            filterObj.categoryID = req.query.categoryID;
        }

        const products = await Product.find(filterObj)
            .populate("categoryID", "name")
            .sort(req.query.sort ? String(req.query.sort) : { createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const total = await Product.countDocuments(filterObj);

        return res.status(200).json({
            message: "Products fetched successfully",
            page,
            limit,
            total,
            data: products,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};