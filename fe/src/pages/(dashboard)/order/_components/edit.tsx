import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditOrder: React.FC = () => {
  const { userId, orderId } = useParams<{ userId: string; orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    console.log('Fetching order with userId:', userId, 'and orderId:', orderId);
    // Fetch order data by ID
    axios.get(`http://localhost:8080/api/v1/orders/${userId}/${orderId}`).then(response => {
      const orderData = response.data;
      setOrder(orderData);
      setStatus(orderData.status);
      setOrderHistory(orderData.history || []);
      setPaymentHistory(orderData.paymentHistory || []);
    }).catch(error => {
      console.error('Error fetching order:', error);
    });
  }, [userId, orderId]);

  const handleUpdateOrder = () => {
    axios.put(`http://localhost:8080/api/v1/orders/${orderId}`, { status }).then(response => {
      console.log('Order updated:', response.data);
      // Update order history with the new status change
      setOrderHistory(prevHistory => [
        ...prevHistory,
        { date: new Date().toISOString(), status }
      ]);
      // Optionally, navigate to the order list page
      navigate('/admin/orders');
    }).catch(error => {
      console.error('There was an error updating the order!', error);
    });
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Chỉnh Sửa Đơn Hàng</h2>
      
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Lịch Sử Đơn Hàng</h3>
        <ul className="list-disc pl-5">
          {orderHistory.map((history, index) => (
            <li key={index}>
              {new Date(history.date).toLocaleString()}: {history.status}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Thông Tin Đơn Hàng</h3>
        <p><strong>Mã Đơn Hàng:</strong> {order._id}</p>
        <p><strong>Mã Đơn Hàng:</strong> {order.orderNumber}</p>
        <p><strong>Khách Hàng:</strong> {order.customerInfo.name}</p>
        <p><strong>Số Điện Thoại:</strong> {order.customerInfo.phone}</p>
        <p><strong>Email:</strong> {order.customerInfo.email}</p>
        <p><strong>Địa Chỉ:</strong> {order.customerInfo.address}</p>
        <p><strong>Tổng Tiền:</strong> {order.totalPrice}</p>
        <p><strong>Trạng Thái:</strong></p>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Danh Sách Sản Phẩm</h3>
        <ul className="list-disc pl-5">
          {order.items.map((item: any, index: number) => (
            <li key={index}>
              {item.name} - Số lượng: {item.quantity} - Giá: {item.price}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Lịch Sử Thanh Toán</h3>
        <ul className="list-disc pl-5">
          {paymentHistory.map((payment, index) => (
            <li key={index}>
              {payment.date}: {payment.amount} - {payment.method}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleUpdateOrder}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Cập Nhật Đơn Hàng
      </button>
    </div>
  );
};

export default EditOrder;