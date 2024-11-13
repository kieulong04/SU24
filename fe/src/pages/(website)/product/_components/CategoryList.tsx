import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
    const { data: categories } = useQuery({
        queryKey: ['CATEGORY_LIST'],
        queryFn: async () => {
            const { data } = await axios.get('http://localhost:8080/api/v1/categories');
            return data;
        },
        staleTime: 60000 // Thời gian "cũ" được đặt là 1 phút (60000 miligiây)
    });

    return (
        <section className="py-8">
            <div className="container mx-auto">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Danh mục</h2>
                    <p className="text-gray-600">Khám phá các danh mục đa dạng của chúng tôi</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories?.map((category: { _id?: number; name: string }) => (
                        <div key={category._id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-xl font-semibold mb-2 text-gray-700">
                                <Link to={`/categories/${category._id}`} className="text-blue-500 ">
                                    {category.name}
                                </Link>
                            </h3>
                            <p className="text-gray-500">Khám phá sản phẩm trong {category.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;