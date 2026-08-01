import { Router } from "express";
import { addProduct } from "./product-controllers/add-product";
import { handleValidationErrors } from "../middlewares/handleValidationErrors";
import { productValidator } from "./product-validato";
import { updateProduct } from "./product-controllers/update-product";
import { getProductById } from "./product-controllers/get-product-by-id";
import { getAllProducts } from "./product-controllers/get-all-product";
import { deleteProduct } from "./product-controllers/delete-product";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import { requirePermission } from "../middlewares/requirePermission.middleware";
import { Permission } from "../user/user-model";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.get('/',
    getAllProducts
);

router.get('/:id',
    getProductById
);

router.post('/add',
    isAuthenticated,
    requirePermission(Permission.CanManageProducts),
    upload.fields([
        { name: 'imageCover', maxCount: 1 },
        { name: 'images', maxCount: 10 },
    ]),
    productValidator,
    handleValidationErrors,
    addProduct
);

router.put('/:id',
    isAuthenticated,
    requirePermission(Permission.CanManageProducts),
    upload.single("image"),
    productValidator,
    handleValidationErrors,
    updateProduct
);

router.delete('/:id',
    isAuthenticated,
    requirePermission(Permission.CanManageProducts),
    deleteProduct
);

export default router;