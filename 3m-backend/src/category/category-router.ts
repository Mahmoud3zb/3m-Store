import { Router } from "express";
import { getAllCategories } from "./category-controllers/get-all-categories";
import { getCategoryById } from "./category-controllers/get-category-by-id";
import { categoryValidator } from "./category-validator";
import { handleValidationErrors } from "../middlewares/handleValidationErrors";
import { deleteCategory } from "./category-controllers/deleteCategory";
import { addCategory } from "./category-controllers/add-category";
import { updateCategory } from "./category-controllers/update-category";
import { requirePermission } from "../middlewares/requirePermission.middleware";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import { Permission } from "../user/user-model";

const router = Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

router.post('/add', 
    isAuthenticated, 
    requirePermission(Permission.CanManageProducts), 
    categoryValidator, 
    handleValidationErrors, 
    addCategory);

router.put('/:id', 
    isAuthenticated,
    requirePermission(Permission.CanManageProducts), 
    categoryValidator, 
    handleValidationErrors, 
    updateCategory);

router.delete('/:id', 
    isAuthenticated, 
    requirePermission(Permission.CanManageProducts), 
    deleteCategory);

export default router;