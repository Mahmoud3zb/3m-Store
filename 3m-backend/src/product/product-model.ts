import mongoose from "mongoose";

// Interface for promotional offers
export interface IProductOffer {
    discountedPrice: number;
    startDate: Date;
    endDate: Date;
}

export interface IProduct extends mongoose.Document {
    userID: mongoose.Types.ObjectId;
    categoryID: mongoose.Types.ObjectId;
    name: string;
    description: string;
    images: string[];
    imageCover: string;
    price: number;
    brand: string;        // e.g., "HP", "Dell", "Lenovo", "Apple", "Asus", "Acer", "MSI"
    processor: string;    // e.g., "Intel Core i7 11th Gen"
    ram: string;          // e.g., "16GB DDR4"
    storage: string;      // e.g., "512GB NVMe SSD"
    gpu: string;          // e.g., "NVIDIA RTX 3050 4GB"
    screen: string;       // e.g., '15.6" FHD IPS'
    grade: string;        // e.g., "فرز أول (Grade A+)", "كسر زيرو (Like New)"
    battery?: string;     // e.g., "ممتازة 85%+"
    warranty?: string;    // e.g., "ضمان 14 يوم تجربة + 3 شهور"
    stockQuantity: number;
    isFeatured?: boolean;
    offer?: IProductOffer;
}

const productSchema = new mongoose.Schema<IProduct>({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    imageCover: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [1, "Price must be at least 1"]
    },
    brand: {
        type: String,
        required: true,
        trim: true,
        default: "HP"
    },
    processor: {
        type: String,
        required: true,
        trim: true,
        default: "Intel Core i7"
    },
    ram: {
        type: String,
        required: true,
        trim: true,
        default: "16GB"
    },
    storage: {
        type: String,
        required: true,
        trim: true,
        default: "512GB SSD"
    },
    gpu: {
        type: String,
        required: true,
        trim: true,
        default: "Intel Iris Xe"
    },
    screen: {
        type: String,
        required: true,
        trim: true,
        default: '15.6" FHD'
    },
    grade: {
        type: String,
        required: true,
        trim: true,
        default: "فرز أول (Grade A+)"
    },
    battery: {
        type: String,
        default: "حالة ممتازة 85%+"
    },
    warranty: {
        type: String,
        default: "ضمان 14 يوم فحص واستبدال + 3 شهور"
    },
    stockQuantity: {
        type: Number,
        required: true,
        min: [0, "Stock cannot be negative"],
        default: 1
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    offer: {
        discountedPrice: { 
            type: Number, 
            min: [0, "Discounted price cannot be negative"],
            validate: {
                validator: function(this: any, val: number) {
                    let price = this.price;
                    if (price === undefined && typeof this.getUpdate === 'function') {
                        const update = this.getUpdate();
                        price = update.price || update.$set?.price;
                    }
                    if (price !== undefined) {
                        return val < price;
                    }
                    return true;
                },
                message: "Discounted price must be less than regular price."
            }
        },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date }
    }
}, { timestamps: true });

export const Product = mongoose.model<IProduct>("Product", productSchema);

