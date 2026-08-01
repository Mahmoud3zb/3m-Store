import mongoose from "mongoose";

// Updated item interface to track purchased variant
interface Iitem {
    productID: mongoose.Types.ObjectId;
    size: string;       // Size ordered
    colorCode: string;  // Color code ordered
    quantity: number;
    price: number;
}

interface IShippingAddress {
    street: string;
    city: string;
    phone: string;
}

interface IIssueReport {
    reason: string;
    details?: string;
    reportedAt: Date;
    status: string;
}

interface IOrder extends mongoose.Document {
    userID: mongoose.Types.ObjectId;
    items: Iitem[];
    shippingAddress: IShippingAddress;
    totalPrice: number;
    status: string;
    paymentMethod: string;
    isPaid?: boolean;
    paidAt?: Date;
    deliveredAt?: Date;
    issueReport?: IIssueReport;
    paymentResult?: {
        id: string;
        status: string;
    };
}

const orderSchema = new mongoose.Schema<IOrder>({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: {
        type: [
            {
                productID: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                size: {
                    type: String,
                    required: [true, "Size is required for order items"]
                },
                colorCode: {
                    type: String,
                    required: [true, "Color code is required for order items"]
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Quantity must be at least 1"]
                },
                price: {
                    type: Number,
                    required: true,
                    min: [0, "Price cannot be negative"]
                }
            }
        ],
        validate: {
            validator: function (item: Iitem[]) {
                return item && item.length > 0;
            },
            message: "To create an order, at least one item is required"
        }
    },
    totalPrice: {
        type: Number,
        required: true,
        min: [0, "Total price cannot be negative"]
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: String, required: true }
    }, 
    paymentMethod: {
        type: String,
        enum: ["cash", "card"],
        default: "cash",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "preparing", "processing", "ready", "shipped", "delivered", "cancelled", "issue_reported"],
        default: "pending",
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false,
        required: true
    },
    paidAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    },
    issueReport: {
        reason: { type: String },
        details: { type: String },
        reportedAt: { type: Date },
        status: { type: String, default: "open" }
    },
    paymentResult: {
        id: { type: String },
        status: { type: String }
    }
}, {
    timestamps: true
});

export const Order = mongoose.model<IOrder>("Order", orderSchema);
