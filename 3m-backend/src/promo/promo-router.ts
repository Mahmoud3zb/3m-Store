import { Router } from "express";
import {
    createPromo,
    getAllPromos,
    deletePromo,
    getActivePromos,
    validatePromoCode
} from "./promo-controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import { requirePermission } from "../middlewares/requirePermission.middleware";
import { Permission } from "../user/user-model";

const router = Router();


router.get("/active", getActivePromos);
router.post("/validate", validatePromoCode);


router.post("/", isAuthenticated, requirePermission(Permission.CanManageProducts), createPromo);
router.get("/", isAuthenticated, requirePermission(Permission.CanManageProducts), getAllPromos);
router.delete("/:id", isAuthenticated, requirePermission(Permission.CanManageProducts), deletePromo);

export default router;
