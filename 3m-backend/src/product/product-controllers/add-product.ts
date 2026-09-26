import { RequestHandler } from "express";
import { Product } from "../product-model";

interface IRequest {
    name: string;
    description: string;
    price: number;
    categoryID: string;
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
}

interface IResponse {
    message: string;
    data?: any;
}

export const addProduct: RequestHandler<{}, IResponse, IRequest> = async (req, res) => {
    try {
        const { 
            name, description, price, categoryID,
            brand, processor, ram, storage, gpu, screen, grade, battery, warranty, stockQuantity, isFeatured 
        } = req.body;
        const userID = req.user?.id;

        if (!userID) {
            return res.status(401).json({ message: "Unauthorized: Admin ID not found" });
        }

        let offerObj: any = undefined;
        if ((req.body as any).offer) {
            if ((req.body as any).offer === "") {
                offerObj = undefined;
            } else if (typeof (req.body as any).offer === "string") {
                try {
                    offerObj = JSON.parse((req.body as any).offer);
                } catch {
                    return res.status(400).json({ message: "Invalid offer format. Must be a valid JSON object." });
                }
            } else {
                offerObj = (req.body as any).offer;
            }
        }

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: "Product name already exists" });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const imageCoverUrl = files?.imageCover?.[0]?.path;
        const imagesUrls = files?.images?.map(file => file.path) || [];

        if (!imageCoverUrl) {
            return res.status(400).json({ message: "Cover image is required" });
        }

        const product = await Product.create({
            name,
            description,
            imageCover: imageCoverUrl,
            images: imagesUrls,
            price: Number(price),
            brand: brand || "HP",
            processor: processor || "Intel Core i7",
            ram: ram || "16GB",
            storage: storage || "512GB SSD",
            gpu: gpu || "Intel Iris Xe",
            screen: screen || '15.6" FHD',
            grade: grade || "فرز أول (Grade A+)",
            battery: battery || "حالة ممتازة 85%+",
            warranty: warranty || "ضمان 14 يوم فحص واستبدال + 3 شهور",
            stockQuantity: stockQuantity ? Number(stockQuantity) : 1,
            isFeatured: isFeatured === true || (req.body as any).isFeatured === "true",
            categoryID,
            offer: offerObj,
            userID
        });

        return res.status(201).json({
            message: "Product created successfully",
            data: product
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};