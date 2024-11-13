import { StatusCodes } from 'http-status-codes';
import Order from '../models/order';

export const createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        return res.status(StatusCodes.CREATED).json(order);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        return res.status(StatusCodes.OK).json(orders);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { userId, orderId } = req.params;
        console.log(`Fetching order with userId: ${userId} and orderId: ${orderId}`);
        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Không tìm thấy đơn hàng" });
        }
        return res.status(StatusCodes.OK).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOneAndUpdate({ _id: orderId }, req.body, {
            new: true,
        });
        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Không tìm thấy đơn hàng" });
        }
        return res.status(StatusCodes.OK).json(order);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatus = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

        if (!validStatus.includes(status)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Trạng thái không hợp lệ" });
        }

        const order = await Order.findOne({ _id: orderId });
        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Không tìm thấy đơn hàng" });
        }

        if (order.status === "delivered" || order.status === "cancelled") {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Không thể cập nhật đơn hàng" });
        }

        // Lưu lịch sử thay đổi trạng thái
        order.history.push({ status });

        order.status = status;
        await order.save();

        return res.status(StatusCodes.OK).json({ message: "Cập nhật trạng thái đơn hàng thành công" });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};