import { useProductQuery } from "@/common/hooks/useProductQuery";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const DetailProduct = () => {
    const { id } = useParams();
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

    const [img, setImg] = useState("");
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        if (product?.gallery) {
            setImg(product.gallery[0]);
            setSelectedImage(0);
        }
    }, [product]);

    if (isLoading || isRelatedLoading) return <p>Loading...</p>;

    const price = product?.price ?? 0;
    const discount = product?.discount ?? 0;

    return (
        <div className="p-4">
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
                            {price - price * (discount / 100)} VND
                        </div>
                        <div className="text-gray-500 line-through mb-4">
                            {price} VND
                        </div>
                        <p className="mb-4">{product?.description}</p>
                        {product?.attributes.map((atr: any, index: number) => {
                            console.log(atr);
                            return (
                                <div className="mb-4" key={index}>
                                    <span className="block mb-2">{atr.name}</span>
                                    {atr.values.map((value: any,index:number) => (
                                        <div className="flex space-x-2" key={index}>
                                            <span className="px-4 py-2 border border-gray-300 cursor-pointer">
                                                {value.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center space-x-0.5">
                                <button className="px-4 py-2 border border-gray-300">
                                    -
                                </button>
                                <span className="px-4 py-2 border border-gray-300">
                                    1
                                </span>
                                <button className="px-4 py-2 border border-gray-300">
                                    +
                                </button>
                            </div>
                            <button className="px-6 py-2 bg-black text-white">
                                Thêm vào giỏ hàng
                            </button>
                            <button className="px-6 py-2 border border-gray-300">
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
                                    to={`/categories/${item.category}`}
                                    className="text-gray-500 mb-2 block"
                                >
                                    {item.category}
                                </Link>
                                <div className="text-red-500 mb-2">
                                    {item.price -
                                        item.price * (item.discount / 100)}{" "}
                                    VND
                                </div>
                                <div className="text-gray-500 line-through">
                                    {item.price} VND
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