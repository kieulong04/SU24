import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const ConfirmPage = () => {
    const { userId, orderId } = useParams();

    const { data: order, isLoading, error } = useQuery({
        queryKey: ['ORDER_DETAIL', userId, orderId],
        queryFn: async () => {
            const { data } = await axios.get(`http://localhost:8080/api/v1/orders/${userId}/${orderId}`);
            return data;
        }
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading order details</p>;

    return (
        <div className="container mx-auto p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">Cảm ơn bạn!</h1>
                <p className="mb-4">Đơn hàng đã hoàn tất</p>
                <p className="mb-4">Cảm ơn bạn đã tin tưởng và lựa chọn sản phẩm tại IRIS Furniture! </p>
                <p className="mb-8">Chúc bạn một ngày tốt lành.</p>
                <Link to="/" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Về trang chủ</Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Chi tiết đơn hàng</h2>
                    {order.items.map((item: any) => (
                        <div key={item.productId} className="border-b py-4">
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <p>Giá: {item.price} VND</p>
                            <p>Số lượng: {item.quantity}</p>
                        </div>
                    ))}
                    <p className="mt-4"><strong>Phương thức thanh toán:</strong> {order.paymentMethod || 'Chưa xác định'}</p>
                    <p className="mt-4"><strong>Lưu ý:</strong> giao hàng cẩn thận giùm mình</p>
                    <p className="mt-4"><strong>Tổng cộng:</strong> {order.totalPrice} VND</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Thông tin thanh toán</h2>
                    <p><strong>Tên:</strong> {order.customerInfo.name}</p>
                    <p><strong>Email:</strong> {order.customerInfo.email}</p>
                    <p><strong>Số điện thoại:</strong> {order.customerInfo.phone}</p>
                    <p><strong>Địa chỉ:</strong> {order.customerInfo.address}</p>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPage;