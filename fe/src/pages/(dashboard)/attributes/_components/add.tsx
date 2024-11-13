/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddAttribute = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            await axios.post("http://localhost:8080/api/v1/attributes", {
                name: data.name,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attributes"] });
            alert("Thêm thuộc tính thành công");
            navigate("/admin/attributes");
        },
        onError: () => {
            alert("Có lỗi xảy ra, vui lòng thử lại sau");
        },
    });

    const onSubmit = (data: any) => {
        mutation.mutate(data);
    };

    return (
        <div className="max-w-screen-md mx-auto p-4">
            <div className="space-y-0.5 mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Thêm thuộc tính</h2>
                <p className="text-gray-600">Thêm thuộc tính mới</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Tên thuộc tính
                    </label>
                    <input
                        {...register("name")}
                        id="name"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Thêm thuộc tính
                </button>
            </form>
        </div>
    );
};

export default AddAttribute;