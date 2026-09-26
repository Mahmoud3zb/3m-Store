export type Role = 'user' | 'admin';

export interface IAddress {
  street: string;
  city: string;
  country: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  address: IAddress;
  profileImage?: string;
  isVerified: boolean;
  role: Role;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  userID: string | IUser;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IProductOffer {
  discountedPrice: number;
  startDate: string;
  endDate: string;
}

export interface IProduct {
  _id: string;
  userID?: string | IUser;
  categoryID: string | ICategory;
  name: string;
  description: string;
  images: string[];
  imageCover: string;
  price: number;
  brand: string;        // e.g. "HP", "Dell", "Lenovo", "Apple", "Asus", "Acer", "MSI"
  processor: string;    // e.g. "Intel Core i7 11th Gen"
  ram: string;          // e.g. "16GB DDR4"
  storage: string;      // e.g. "512GB NVMe SSD"
  gpu: string;          // e.g. "NVIDIA RTX 3050 4GB"
  screen: string;       // e.g. '15.6" FHD IPS'
  grade: string;        // e.g. "فرز أول (Grade A+)" or "كسر زيرو (Like New)"
  battery?: string;     // e.g. "ممتازة 85%+"
  warranty?: string;    // e.g. "ضمان 14 يوم تجربة + 3 شهور"
  stockQuantity: number;
  isFeatured?: boolean;
  offer?: IProductOffer;
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  productID: IProduct;
  quantity: number;
  specsSummary?: string;
  _id?: string;
}

export interface ICart {
  _id: string;
  userID: string;
  items: ICartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  altPhone?: string;
  city: string;
  street: string;
  notes?: string;
}

export interface IOrderItem {
  productID: IProduct | string;
  quantity: number;
  price: number;
  specsSummary?: string;
  _id?: string;
}

export interface IOrder {
  _id: string;
  userID?: string | IUser;
  items: IOrderItem[];
  totalPrice: number;
  shippingAddress: IShippingAddress;
  paymentMethod: 'cash' | 'card';
  status: 'pending' | 'preparing' | 'processing' | 'ready' | 'shipped' | 'delivered' | 'cancelled' | 'issue_reported';
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  _id: string;
  userID: string | IUser;
  productID: string | IProduct;
  rate: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

