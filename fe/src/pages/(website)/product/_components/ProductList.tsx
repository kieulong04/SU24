import { IProduct } from '@/common/types/product';
import { Link } from 'react-router-dom';
import Pagination from '../../../../components/Pagination';

type ProductListProps = {
    products?: IProduct[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
};

const ProductList = ({ products, pagination }: ProductListProps) => {
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
                                <Link to={`/categories/${product.category}`} className="text-gray-500 text-sm mb-2 block">
                                    Category
                                </Link>
                                <div className="flex items-center mb-2">
                                    <span className="text-red-500 text-xl font-bold mr-2">
                                        {product.price - product.price * (product.discount / 100)} VND
                                    </span>
                                    {product.discount > 0 && (
                                        <span className="text-gray-500 line-through">
                                            {product.price} VND
                                        </span>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <Link
                                        to={`/products/${product._id}`}
                                        className="flex-1 bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600"
                                    >
                                        Quick View
                                    </Link>
                                    <button
                                        className="flex-1 bg-green-500 text-white text-center py-2 rounded hover:bg-green-600"
                                        // onClick={() => mutate({ productId: product._id, quantity: 1 })}
                                    >
                                        Add To Cart
                                    </button>
                                </div>
                                <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
                                    <span className="cursor-pointer hover:text-gray-700">Share</span>
                                    <span className="cursor-pointer hover:text-gray-700">Compare</span>
                                    <span className="cursor-pointer hover:text-gray-700">Like</span>
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