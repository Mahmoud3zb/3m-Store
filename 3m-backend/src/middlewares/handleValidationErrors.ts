import { RequestHandler } from "express";
import { validationResult, FieldValidationError } from "express-validator";

const translationsAr: Record<string, string> = {
    "Name is required": "الاسم مطلوب",
    "Name must be at least 2 characters long": "يجب أن يكون الاسم من حرفين على الأقل",
    "Name must be at least 3 characters": "يجب أن يكون الاسم 3 أحرف على الأقل",
    "Description is required": "الوصف مطلوب",
    "Images must be an array": "الصور يجب أن تكون في مصفوفة",
    "Price is required": "السعر مطلوب",
    "Price must be at least 1": "يجب أن يكون السعر 1 على الأقل",
    "Variants are required": "أنواع ومتغيرات المنتج مطلوبة",
    "Category ID is required": "قسم المنتج مطلوب",
    "Invalid Category ID format": "صيغة معرف القسم غير صالحة",
    "Email is required": "البريد الإلكتروني مطلوب",
    "Invalid email format": "صيغة البريد الإلكتروني غير صالحة",
    "Password is required": "كلمة المرور مطلوبة",
    "Password must be at least 6 characters": "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
    "Validation failed": "فشل التحقق من صحة البيانات المُدخلة"
};

export const handleValidationErrors: RequestHandler = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const lang = (req.headers["accept-language"] || req.headers["lang"] || "en").toString().toLowerCase();
        const isAr = lang.includes("ar");

        const formattedErrors = errors.array().map(err => {
            const e = err as FieldValidationError;
            const msg = e.msg;
            const localizedMsg = isAr && translationsAr[msg] ? translationsAr[msg] : msg;
            return {
                field: e.path,
                message: localizedMsg
            };
        });

        const mainMessage = isAr ? "فشل التحقق من البيانات المُدخلة" : "Validation failed";

        return res.status(400).json({
            success: false,
            message: formattedErrors.length > 0 ? formattedErrors[0].message : mainMessage,
            errors: formattedErrors
        });
    }

    next();
};
