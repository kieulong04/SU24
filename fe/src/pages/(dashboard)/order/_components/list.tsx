import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

interface Order {
    _id: string;
    orderNumber: string;
    items: { length: number }[];
    totalPrice: number;
    customerInfo: { name: string };
    createdAt: string;
    status: string;
    userId: string; // Thêm userId vào interface Order
}

const OrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    const handleEdit = (userId: string, orderId: string) => {
        navigate(`/admin/orders/${userId}/${orderId}/edit`);
    };

    useEffect(() => {
        // Fetch orders from API
        axios.get('http://localhost:8080/api/v1/orders')
            .then(response => {
                setOrders(response.data);
                setFilteredOrders(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the orders!', error);
            });
    }, []);

    useEffect(() => {
        // Filter orders based on search term and status filter
        let filtered = orders;
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (statusFilter) {
            filtered = filtered.filter(order => order.status === statusFilter);
        }
        setFilteredOrders(filtered);
    }, [searchTerm, statusFilter, orders]);

    return (
        <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Quản Lý Đơn Hàng</h2>
            <div className="mb-4 flex justify-between">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Đang xử lý</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                </select>
            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">STT</th>
                        <th className="py-2">Mã</th>
                        <th className="py-2">Tổng Sản Phẩm</th>
                        <th className="py-2">Tổng Số Tiền</th>
                        <th className="py-2">Tên Khách Hàng</th>
                        <th className="py-2">Ngày Tạo</th>
                        <th className="py-2">Trạng Thái</th>
                        <th className="py-2">Chỉnh Sửa</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order, index) => (
                        <tr key={order._id}>
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{order.orderNumber}</td>
                            <td className="border px-4 py-2">{order.items.length}</td>
                            <td className="border px-4 py-2">{order.totalPrice}</td>
                            <td className="border px-4 py-2">{order.customerInfo.name}</td>
                            <td className="border px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="border px-4 py-2">{order.status}</td>
                            <td className="py-2 px-4 border-b text-center">
                                <button
                                    onClick={() => handleEdit(order.userId, order._id)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <FontAwesomeIcon icon={faEdit} className="h-5 w-5 inline" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;