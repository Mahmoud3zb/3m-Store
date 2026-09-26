import { RequestHandler } from "express";
import mongoose from "mongoose";
import { Order } from "../order-model";
import { Cart } from "../../cart/cart-model";
import { Product } from "../../product/product-model";
import { Promo } from "../../promo/promo-model";
import { body } from "express-validator";
import { emailService } from "../../services/email-service";

export const validator = [
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
        .withMessage("Address street details are required"),
    body("paymentMethod")
        .optional()
        .isIn(["cash", "card"])
        .withMessage("Payment method must be 'cash' or 'card'")
];

interface IShippingAddress {
    fullName: string;
    phone: string;
    altPhone?: string;
    city: string;
    street: string;
    notes?: string;
}

interface IRequest {
    shippingAddress: IShippingAddress;
    paymentMethod?: string;
    promoCode?: string;
    guestCartItems?: Array<{
        productID: string;
        quantity: number;
    }>;
}

interface IResponse {
    message: string;
    data?: any;
}

export const createOrder: RequestHandler<{}, IResponse, IRequest> = async (req, res) => {
    const userID = req.user?.id;
    const { shippingAddress, paymentMethod, promoCode, guestCartItems } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let itemsToProcess: Array<{ productID: string; quantity: number }> = [];

        if (userID) {
            const cart = await Cart.findOne({ userID }).session(session);
            if (cart && cart.items.length > 0) {
                itemsToProcess = cart.items.map(item => ({
                    productID: item.productID.toString(),
                    quantity: item.quantity
                }));
            }
        }

        if (itemsToProcess.length === 0 && guestCartItems && guestCartItems.length > 0) {
            itemsToProcess = guestCartItems;
        }

        if (itemsToProcess.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Your cart is empty" });
        }

        let calculatedTotal = 0;
        const orderItems: any[] = [];

        for (const item of itemsToProcess) {
            const product = await Product.findById(item.productID).session(session);
            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: "Product no longer exists" });
            }

            if (product.stockQuantity < item.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ 
                    message: `Insufficient stock for product: ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}` 
                });
            }

            product.stockQuantity -= item.quantity;
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

            calculatedTotal += itemPrice * item.quantity;

            orderItems.push({
                productID: product._id,
                quantity: item.quantity,
                price: itemPrice,
                specsSummary: `${product.brand} ${product.name} | ${product.processor} | ${product.ram} RAM | ${product.storage}`
            });
        }

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
            paymentMethod: paymentMethod || "cash"
        }], { session });

        if (userID) {
            await Cart.findOneAndUpdate({ userID }, { items: [] }, { session });
        }

        await session.commitTransaction();
        session.endSession();

        await newOrder.populate([
            { path: "items.productID", select: "name imageCover brand processor ram storage price" }
        ]);

        if (userID) {
            await newOrder.populate({ path: "userID", select: "name email" });
        }

        emailService.sendNewOrderCustomerAlert(newOrder).catch(err => console.error("Customer order email error:", err));

        return res.status(201).json({
            message: "Order created successfully",
            data: newOrder
        });

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.error("Create Order Transaction Error:", error);
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};

