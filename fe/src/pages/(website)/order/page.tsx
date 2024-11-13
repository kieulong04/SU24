import useCart from "@/common/hooks/useCart";
import { useLocalStorage } from "@/common/hooks/useStorage";
import { IProduct } from "@/common/types/product";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
    const form = useForm({
        mode: "onBlur",
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            address: "",
        },
    });
    const { register, handleSubmit, setValue, formState: { errors } } = form;
    const [user] = useLocalStorage("user", {});
    const userId = user?.user?._id;
    const { data, calculateTotalPrice } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setValue("name", user.user.name || "");
            setValue("phone", user.user.phone || "");
            setValue("email", user.user.email || "");
            setValue("address", user.user.address || "");
        }
    }, [user, setValue]);

    const { mutate } = useMutation({
        mutationFn: async (order: {
            userId: string;
            items: [];
            totalPrice: number;
            customerInfo: object;
        }) => {
            const { data } = await axios.post(
                "http://localhost:8080/api/v1/orders",
                order,
            );
            return data;
        },
        onSuccess: (data) => {
            navigate(`/confirm/${userId}/${data._id}`);
        },
    });

    const onSubmit = (formData: object) => {
        mutate({
            userId,
            items: data?.products,
            totalPrice: calculateTotalPrice(),
            customerInfo: formData,
        });
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Đặt hàng</h1>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <Form {...form}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-8 bg-white p-6 rounded-lg shadow-md"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Tên"
                                                {...field}
                                                {...register("name", {
                                                    required: "Tên là bắt buộc",
                                                    minLength: {
                                                        value: 3,
                                                        message: "Tên phải có ít nhất 3 ký tự",
                                                    },
                                                    maxLength: {
                                                        value: 30,
                                                        message: "Tên không được vượt quá 30 ký tự",
                                                    },
                                                })}
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </FormControl>
                                        {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="tel"
                                                placeholder="Số điện thoại"
                                                {...field}
                                                {...register("phone", {
                                                    required: "Số điện thoại là bắt buộc",
                                                    pattern: {
                                                        value: /^0\d{9}$/,
                                                        message: "Số điện thoại không hợp lệ",
                                                    },
                                                })}
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </FormControl>
                                        {errors.phone && <FormMessage>{errors.phone.message}</FormMessage>}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Email của bạn"
                                                {...field}
                                                {...register("email", {
                                                    required: "Email là bắt buộc",
                                                    pattern: {
                                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                        message: "Email không hợp lệ",
                                                    },
                                                })}
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </FormControl>
                                        {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Địa chỉ</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Địa chỉ"
                                                {...field}
                                                {...register("address", {
                                                    required: "Địa chỉ là bắt buộc",
                                                })}
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </FormControl>
                                        {errors.address && <FormMessage>{errors.address.message}</FormMessage>}
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                                Hoàn thành đơn hàng
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h2>
                    {data?.products?.map((item: IProduct) => (
                        <div key={item._id} className="border-b py-4 flex items-center">
                            <div>
                                <h4 className="text-lg font-semibold">{item.name}</h4>
                                <p>Giá: {item.price} VND</p>
                                <p>Số lượng: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                    <p className="mt-5">
                        <strong className="mr-2">Sản phẩm:</strong>
                        {data?.products ? data?.products.length : 0}
                    </p>
                    <p>
                        <strong className="mr-2">Tổng tiền:</strong>
                        {calculateTotalPrice()} VND
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;