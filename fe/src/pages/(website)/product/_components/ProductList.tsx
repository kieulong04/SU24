import { IProduct } from '@/common/types/product';
import { Link } from 'react-router-dom';
import Pagination from '../../../../components/Pagination';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useLocalStorage } from '@/common/hooks/useStorage';

type ProductListProps = {
    products?: IProduct[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
};

const ProductList = ({ products, pagination }: ProductListProps) => {
    const queryClient = useQueryClient();
    const [user] = useLocalStorage("user", {}); 
    console.log(user);
    const userId = user?.user._id;

    const { mutate } = useMutation({
        mutationFn: async ({ productId, quantity }: { productId: string | number; quantity: number }) => {
            const { data } = await axios.post(`http://localhost:8080/api/v1/carts/add-to-cart`, { userId, productId, quantity });
            return data;
        }
        ,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cart", userId],
            });
        }
    });
    console.log(products);

    const { totalPages } = pagination || { totalPages: 1 };
    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products?.map((product: IProduct, index: number) => {
                    return (
                        <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="relative">
                                <img
                                    src={`http://localhost:8080/${product.image}`}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                {product.discount > 0 && (
                                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                        {product.discount}%
                                    </span>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2">
                                    <Link to={`/products/${product._id}`} className="text-blue-500 hover:underline">
                                        {product.name}
                                    </Link>
                                </h3>
                                <Link to={`/categories/${product.category?._id}`} className="text-gray-500 text-sm mb-2 block">
                                    {product.category?.name}
                                </Link>
                                <div className="flex items-center mb-2 ">
                                    <span className="text-red-500 text-xl font-bold mr-2 pr-5">
                                        {product.price - product.price * (product.discount / 100)} VND
                                    </span>
                                    {product.discount > 0 && (
                                        <span className="text-gray-500 line-through pl-">
                                            {product.price} VND
                                        </span>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <Link
                                        to={`/products/${product._id}`}
                                        className="flex-1 bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600"
                                    >
                                        Xem sản phẩm
                                    </Link>
                                    <button
                                        className="flex-1 bg-green-500 text-white text-center py-2 rounded hover:bg-green-600"
                                        onClick={() =>product._id && mutate({ productId: product._id, quantity: 1 })}
                                    >
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-6">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
};

export default ProductList;