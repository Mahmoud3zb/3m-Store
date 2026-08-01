import { Router } from "express";
import { getAllOrders } from "./order-controller/get-all-orders";
import { getOrderById } from "./order-controller/get-order-by-id";
import { getUserOrders } from "./order-controller/get-user-orders";
import { updateOrderStatus } from "./order-controller/update-order-status";
import { confirmDelivery } from "./order-controller/confirm-delivery";
import { reportOrderIssue } from "./order-controller/report-issue";
import { createOrder, validator } from "./order-controller/create-order";
import { directOrder, directValidator } from "./order-controller/direct-order";
import { getAnalytics } from "./order-controller/get-analytics";
import { handleValidationErrors } from "../middlewares/handleValidationErrors";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import { requirePermission } from "../middlewares/requirePermission.middleware";
import { Permission } from "../user/user-model";

const router = Router();

router.post(
    '/',
    isAuthenticated,
    validator,
    handleValidationErrors,
    createOrder
);

router.post(
    '/direct',
    isAuthenticated,
    directValidator,
    handleValidationErrors,
    directOrder
);

router.get(
    '/',
    isAuthenticated,
    requirePermission(Permission.CanViewOrders),
    getAllOrders
);

router.get(
    '/admin/analytics',
    isAuthenticated,
    requirePermission(Permission.CanViewAnalytics),
    getAnalytics
);

router.get(
    '/user',
    isAuthenticated,
    getUserOrders
);

router.post(
    '/:id/confirm-delivery',
    isAuthenticated,
    confirmDelivery
);

router.post(
    '/:id/report-issue',
    isAuthenticated,
    reportOrderIssue
);

router.get(
    '/:id',
    isAuthenticated,
    getOrderById
);

router.put(
    '/:id',
    isAuthenticated,
    requirePermission(Permission.CanViewOrders),
    updateOrderStatus
);

export default router;