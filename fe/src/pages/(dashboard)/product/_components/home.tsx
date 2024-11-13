/* esl/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';

const fetchProducts = async () => {
    const response = await axios.get('http://localhost:8080/api/v1/products');
    return response.data;
};

const ProductList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });

    const handleAddNew = () => {
        navigate('/admin/products/add');
    };

    const handleEdit = (id: string) => {
        navigate(`/admin/products/${id}/edit`);
    };
    const filteredProducts = data?.data?.filter((product: any) => {
        const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatusFilter =
            statusFilter === 'all' ||
            (statusFilter === 'selling' && product.countInStock > 0) ||
            (statusFilter === 'stopped' && product.countInStock <= 0);
        return matchesSearchTerm && matchesStatusFilter;
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Danh sách sản phẩm</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Thêm mới
                </button>
            </div>
            <div className="mb-4 flex space-x-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border rounded w-full"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border rounded"
                >
                    <option value="all">Tất cả</option>
                    <option value="selling">Đang bán</option>
                    <option value="stopped">Ngừng bán</option>
                </select>
            </div>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b text-left">STT</th>
                        <th className="py-2 px-4 border-b text-left">Tên sản phẩm</th>
                        <th className="py-2 px-4 border-b text-left">Ngày thêm</th>
                        <th className="py-2 px-4 border-b text-left">Số lượng</th>
                        <th className="py-2 px-4 border-b text-left">Trạng thái</th>
                        <th className="py-2 px-4 border-b text-center">Chức năng</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product: any, index: number) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">{index + 1}</td>
                            <td className="py-2 px-4 border-b">{product.name}</td>
                            <td className="py-2 px-4 border-b">{new Date(product.createdAt).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b">{product.countInStock}</td>
                            <td className="py-2 px-4 border-b">
                                {product.countInStock > 0 ? 'Đang bán' : 'Ngừng bán'}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                <button
                                    onClick={() => handleEdit(product._id)}
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

export default ProductList;