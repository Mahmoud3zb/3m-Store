import { RequestHandler } from "express";
import mongoose from "mongoose";
import { Order } from "../order-model";
import { Product } from "../../product/product-model";
import { body } from "express-validator";
import { emailService } from "../../services/email-service";
import { Promo } from "../../promo/promo-model";

export const directValidator = [
    body("productID")
        .trim()
        .notEmpty()
        .withMessage("Product ID is required"),
    body("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),
    body("shippingAddress.fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required"),
    body("shippingAddress.phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required"),
    body("shippingAddress.city")
        .trim()
        .notEmpty()
        .withMessage("City is required"),
    body("shippingAddress.street")
        .trim()
        .notEmpty()
        .withMessage("Street address is required"),
];

interface IShippingAddress {
    fullName: string;
    phone: string;
    altPhone?: string;
    city: string;
    street: string;
    notes?: string;
}

interface IDirectRequest {
    productID: string;
    quantity: number;
    shippingAddress: IShippingAddress;
    promoCode?: string;
}

interface IResponse {
    message: string;
    data?: any;
}

export const directOrder: RequestHandler<{}, IResponse, IDirectRequest> = async (req, res) => {
    const userID = req.user?.id;
    const { productID, quantity, shippingAddress, promoCode } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const product = await Product.findById(productID).session(session);
        if (!product) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.stockQuantity < quantity) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ 
                message: `Insufficient stock for product: ${product.name}. Available: ${product.stockQuantity}` 
            });
        }

        product.stockQuantity -= quantity;
        await product.save({ session });

        let itemPrice = product.price;
        if (product.offer && product.offer.discountedPrice !== undefined) {
            const now = new Date();
            const start = new Date(product.offer.startDate);
            const end = new Date(product.offer.endDate);
            if (now >= start && now <= end) {
                itemPrice = product.offer.discountedPrice;
            }
        }

        const calculatedTotal = itemPrice * quantity;

        const orderItems = [{
            productID: product._id,
            quantity,
            price: itemPrice,
            specsSummary: `${product.brand} ${product.name} | ${product.processor} | ${product.ram} RAM | ${product.storage}`
        }];

        let shippingFee = 0;
        const city = shippingAddress?.city || "";
        const cairoGiza = ['القاهرة', 'الجيزة', 'Cairo', 'Giza'];
        const deltaAndCanal = [
            'الإسكندرية', 'القليوبية', 'الدقهلية', 'الشرقية', 'المنوفية', 'الغربية', 'دمياط', 'بورسعيد', 'السويس', 'الإسماعيلية',
            'Alexandria', 'Qalyubia', 'Dakahlia', 'Sharqia', 'Monufia', 'Gharbia', 'Damietta', 'Port Said', 'Suez', 'Ismailia'
        ];
        
        if (cairoGiza.includes(city)) {
            shippingFee = 100;
        } else if (deltaAndCanal.includes(city)) {
            shippingFee = 80;
        } else {
            shippingFee = 60;
        }

        let discount = 0;
        if (promoCode) {
            const promo = await Promo.findOne({ code: promoCode.trim().toUpperCase(), isActive: true }).session(session);
            if (promo) {
                if (promo.discountType === "percentage") {
                    discount = Math.round(calculatedTotal * (promo.discountValue / 100));
                } else if (promo.discountType === "fixed") {
                    discount = Math.min(calculatedTotal, promo.discountValue);
                }
            }
        }

        const finalTotal = Math.max(0, calculatedTotal - discount + shippingFee);

        const [newOrder] = await Order.create([{
            userID: userID ? userID : undefined,
            items: orderItems,
            totalPrice: finalTotal,
            shippingAddress,
            paymentMethod: "cash" 
        }], { session });

        await session.commitTransaction();
        session.endSession();

        await newOrder.populate([
            { path: "items.productID", select: "name imageCover brand processor ram storage price" }
        ]);

        if (userID) {
            await newOrder.populate({ path: "userID", select: "name email" });
        }

        emailService.sendNewOrderCustomerAlert(newOrder).catch(err => console.error("Customer direct order email error:", err));

        return res.status(201).json({
            message: "Direct order created successfully",
            data: newOrder
        });

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.error("Direct Order Error:", error);
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};

