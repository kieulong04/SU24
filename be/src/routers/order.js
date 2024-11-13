import { Router } from "express";
import { createOrder, getOrderById, getOrders, updateOrder, updateOrderStatus } from "../controllers/order";

const router = Router();

router.post("/orders", createOrder); // Route để tạo đơn hàng mới
router.get("/orders", getOrders); // Route để lấy danh sách đơn hàng
router.get("/orders/:userId/:orderId", getOrderById); // Route để lấy thông tin đơn hàng theo userId và orderId
router.put("/orders/:orderId", updateOrder); // Route để cập nhật thông tin đơn hàng
router.patch("/orders/:orderId/status", updateOrderStatus); // Route để cập nhật trạng thái đơn hàng

export default router;