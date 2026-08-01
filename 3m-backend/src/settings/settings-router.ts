import { Router } from "express";
import { getSettings, updateSettings } from "./settings-controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import { requirePermission } from "../middlewares/requirePermission.middleware";
import { Permission } from "../user/user-model";

const router = Router();

// GET settings is public
router.get("/", getSettings);

// PUT settings requires authentication and CanManageSettings permission
router.put(
    "/",
    isAuthenticated,
    requirePermission(Permission.CanManageSettings),
    updateSettings
);

export default router;
