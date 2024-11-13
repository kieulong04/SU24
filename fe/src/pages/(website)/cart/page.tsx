import useCart from "@/common/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CartPage = () => {
    const {
        data,
        handleInputChange,
        handleInputBlur,
        handleInputKeyDown,
        mutate,
        calculateTotalPrice,
        isLoading,
        isError,
        quantities,
    } = useCart();
    const navigate = useNavigate();

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error</div>;

    const handleCheckout = () => {
        navigate("/order");
    };

    const handleShop = () => {
        navigate("/shop");
    };

    const calculateDiscountedPrice = (price: number, discount: number) => {
        return price - (price * discount) / 100;
    };

    const handleQuantityChange = (productId: string, quantity: number, countInStock: number) => {
        if (quantity > countInStock) {
            toast.error("Số lượng yêu cầu vượt quá số lượng tồn kho!");
        } else if (quantity < 1) {
            toast.error("Số lượng phải lớn hơn 0!");
        } else {
            handleInputChange(productId, { target: { value: quantity.toString() } } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <ToastContainer />
            {data?.products.length === 0 ? (
                <div className="text-center">
                    <p className="text-lg mb-4">
                        Giỏ hàng của bạn đang trống. Hãy thêm sản phẩm vào giỏ hàng!
                    </p>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleShop}
                    >
                        Mua hàng
                    </button>
                </div>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-4">
                        Giỏ hàng của bạn
                    </h1>
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b text-left">
                                    #
                                </th>
                                <th className="py-2 px-4 border-b text-left">
                                    Tên sản phẩm
                                </th>
                                <th className="py-2 px-4 border-b text-right">
                                    Giá
                                </th>
                                <th className="py-2 px-4 border-b text-center">
                                    Số lượng
                                </th>
                                <th className="py-2 px-4 border-b text-right">
                                    Tổng
                                </th>
                                <th className="py-2 px-4 border-b text-center">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.products.map(
                                (product: any, index: number) => {
                                    const price = parseFloat(product.price) || 0;
                                    const discount = parseFloat(product.discount) || 0;
                                    const discountedPrice = calculateDiscountedPrice(price, discount);
                                    return (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="py-2 px-4 border-b text-center">
                                                {index + 1}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {product.name}
                                            </td>
                                            <td className="py-2 px-4 border-b text-right">
                                                {discountedPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        className="w-8 h-8 bg-gray-200 rounded-l hover:bg-gray-300 focus:outline-none flex items-center justify-center"
                                                        onClick={() =>
                                                            mutate({
                                                                action: "DECREMENT",
                                                                productId:
                                                                    product.productId,
                                                            })
                                                        }
                                                        disabled={
                                                            product.quantity <=
                                                            1
                                                        }
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        className="w-12 h-8 text-center border-t border-b border-gray-300 focus:outline-none appearance-none"
                                                        value={
                                                            quantities[
                                                                product
                                                                    .productId
                                                            ] ??
                                                            product.quantity
                                                        }
                                                        onChange={(e) =>
                                                            handleQuantityChange(
                                                                product.productId,
                                                                parseInt(e.target.value),
                                                                product.countInStock
                                                            )
                                                        }
                                                        onBlur={(e) =>
                                                            handleInputBlur(
                                                                product.productId,
                                                                e,
                                                            )
                                                        }
                                                        onKeyDown={(e) =>
                                                            handleInputKeyDown(
                                                                product.productId,
                                                                e,
                                                            )
                                                        }
                                                        min="1"
                                                    />
                                                    <button
                                                        className="w-8 h-8 bg-gray-200 rounded-r hover:bg-gray-300 focus:outline-none flex items-center justify-center"
                                                        onClick={() =>
                                                            mutate({
                                                                action: "INCREMENT",
                                                                productId:
                                                                    product.productId,
                                                            })
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 border-b text-right">
                                                {(discountedPrice * product.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </td>
                                            <td className="py-2 px-4 border-b text-center">
                                                <button
                                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                    onClick={() =>
                                                        mutate({
                                                            action: "REMOVE",
                                                            productId:
                                                                product.productId,
                                                        })
                                                    }
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                },
                            )}
                        </tbody>
                    </table>
                    <div className="mt-4 text-right">
                        <span className="text-xl font-bold">
                            Tổng cộng: {calculateTotalPrice().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </span>
                    </div>
                    <div className="mt-4 text-right">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={handleCheckout}
                        >
                            Thanh toán
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;