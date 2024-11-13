import { useProductQuery } from "@/common/hooks/useProductQuery";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@/common/hooks/useStorage";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const DetailProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [img, setImg] = useState("");
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const queryClient = useQueryClient();
    const [user] = useLocalStorage("user", {});
    const userId = user?.user._id;

    const { data: product, isLoading } = useProductQuery({ id: id! });

    const { data: relatedProduct, isLoading: isRelatedLoading } = useQuery({
        queryKey: ["RELATED_PRODUCT", product?.category?._id, product?._id],
        queryFn: async () => {
            if (product?.category?._id && product?._id) {
                const { data } = await axios.get(
                    `http://localhost:8080/api/v1/products/${product.category._id}/related/${product._id}`
                );
                return data;
            }
        },
        enabled: !!product?.category?._id && !!product?._id, // Chỉ chạy query khi product.category._id và product._id có giá trị
    });

    useEffect(() => {
        if (product?.gallery) {
            setImg(product.gallery[0]);
            setSelectedImage(0);
        }
    }, [product]);

    const { mutate } = useMutation({
        mutationFn: async ({ productId, quantity }: { productId: string | number; quantity: number }) => {
            const { data } = await axios.post(`http://localhost:8080/api/v1/carts/add-to-cart`, { userId, productId, quantity });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cart", userId],
            });
            toast.success("Thêm vào giỏ hàng thành công!");
            setQuantity(1); // Đặt lại số lượng về 1 sau khi thêm thành công
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
        }
    });

    if (isLoading || isRelatedLoading) return <p>Loading...</p>;

    const price = product?.price ?? 0;
    const discount = product?.discount ?? 0;
    const countInStock = product?.countInStock ?? 0;

    const handleIncreaseQuantity = () => {
        if (quantity < countInStock) {
            setQuantity(prevQuantity => prevQuantity + 1);
        } else {
            toast.error("Số lượng yêu cầu vượt quá số lượng tồn kho!");
        }
    };

    const handleDecreaseQuantity = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (value > 0 && value <= countInStock) {
            setQuantity(value);
        } else if (value > countInStock) {
            toast.error("Số lượng yêu cầu vượt quá số lượng tồn kho!");
        }
    };

    const handleAddToCart = () => {
        if (countInStock <= 0) {
            toast.error("Sản phẩm đã hết hàng!");
        } else if (quantity > countInStock) {
            toast.error("Số lượng yêu cầu vượt quá số lượng tồn kho!");
        } else {
            if (product._id) {
                mutate({ productId: product._id, quantity });
            }
        }
    };

    const handleBuyNow = () => {
        if (countInStock <= 0) {
            toast.error("Sản phẩm đã hết hàng!");
        } else if (quantity > countInStock) {
            toast.error("Số lượng yêu cầu vượt quá số lượng tồn kho!");
        } else {
            if (product._id) {
                mutate({ productId: product._id, quantity }, {
                    onSuccess: () => {
                        navigate('/cart');
                    }
                });
            }
        }
    };

    return (
        <div className="p-4">
            <ToastContainer />
            <section className="bg-gray-100 py-4">
                <div className="container mx-auto">
                    <div className="flex items-center space-x-2">
                        <Link to="/" className="text-blue-500">
                            Home
                        </Link>
                        <span>/</span>
                        <Link to="/shop" className="text-blue-500">
                            Shop
                        </Link>
                        <span>/</span>
                        <span className="font-bold">{product?.name}</span>
                    </div>
                </div>
            </section>
            <section className="py-8">
                <div className="container mx-auto flex space-x-8">
                    <div className="flex-1">
                        <div className="flex flex-col space-y-4">
                            <div className="w-full h-96">
                                <img
                                    src={`http://localhost:8080/${img}`}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex space-x-4">
                                {product?.gallery.map(
                                    (item: any, index: number) => (
                                        <div
                                            key={index}
                                            className={`w-24 h-24 border ${selectedImage === index ? "border-blue-500" : "border-gray-300"} cursor-pointer`}
                                            onMouseEnter={() => {
                                                setImg(item);
                                                setSelectedImage(index);
                                            }}
                                        >
                                            <img
                                                src={`http://localhost:8080/${item}`}
                                                alt="#"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-4">
                            {product?.name}
                        </h1>
                        <div className="text-2xl text-red-500 mb-2">
                            {(price - price * (discount / 100)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </div>
                        <div className="text-gray-500 line-through mb-4">
                            {price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </div>
                        <p className="mb-4">{product?.description}</p>
                        {product?.attributes.map((atr: any, index: number) => {
                            return (
                                <div className="mb-4" key={index}>
                                    <span className="block mb-2">{atr.name}</span>
                                    {atr.values.map((value: any, index: number) => (
                                        <div className="flex space-x-2" key={index}>
                                            <span className="px-4 py-2 border border-gray-300 cursor-pointer">
                                                {value.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                        <div className="mb-4">
                            <span className="block mb-2">Số lượng còn lại: {countInStock}</span>
                            {countInStock <= 0 && (
                                <span className="text-red-500">Sản phẩm đã hết hàng</span>
                            )}
                        </div>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center space-x-0.5">
                                <button className="px-4 py-2 border border-gray-300" onClick={handleDecreaseQuantity} disabled={countInStock <= 0}>
                                    -
                                </button>
                                <input
                                    type="number"
                                    className="w-16 px-4 py-2 border border-gray-300 text-center"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    min="1"
                                    max={countInStock}
                                    disabled={countInStock <= 0}
                                />
                                <button className="px-4 py-2 border border-gray-300" onClick={handleIncreaseQuantity} disabled={countInStock <= 0}>
                                    +
                                </button>
                            </div>
                            <button className="px-6 py-2 bg-black text-white" onClick={handleAddToCart} disabled={countInStock <= 0}>
                                Thêm vào giỏ hàng
                            </button>
                            <button className="px-6 py-2 border border-gray-300" onClick={handleBuyNow} disabled={countInStock <= 0}>
                                Mua hàng
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-8">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-bold mb-4">
                        Sản phẩm cùng danh mục
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {relatedProduct?.slice(0, 6).map((item: any) => (
                            <div key={item._id} className="border p-4">
                                <img
                                    src={`http://localhost:8080/${item.image}`}
                                    alt={item.name}
                                    className="w-full h-48 object-cover mb-4"
                                />
                                <h3 className="text-lg font-bold mb-2">
                                    <Link to={`/products/${item.slug}`}>
                                        {item.name}
                                    </Link>
                                </h3>
                                <Link
                                    to={`/categories/${item.category._id}`}
                                    className="text-gray-500 mb-2 block"
                                >
                                    {item.category.name}
                                </Link>
                                <div className="text-red-500 mb-2">
                                    {(item.price - item.price * (item.discount / 100)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </div>
                                <div className="text-gray-500 line-through">
                                    {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DetailProduct;