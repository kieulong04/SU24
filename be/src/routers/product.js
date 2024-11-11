import { Router } from "express";
import {
    create,
    deleteProductById,
    getAllProducts,
    getProductById,
    related,
    updateProductById
} from "../controllers/product";
import { checkAuth } from "../middleware/checkAuth";
import upload from "../middleware/upload"; // Import middleware upload

const router = Router();
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/products/:categoryId/related/:productId", related);
router.delete("/products/:id", deleteProductById);
router.put("/products/:id", upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 4 }
]), updateProductById); // Route để cập nhật sản phẩm và ảnh
router.post("/products", upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 4 }
]), create); // Route để thêm sản phẩm và ảnh

export default router;