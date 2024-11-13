import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocalStorage } from '@/common/hooks/useStorage';
import { Auth } from '@/common/types/auth';

const schema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Email không hợp lệ',
    'string.empty': 'Email không được để trống',
    'any.required': 'Email là trường bắt buộc'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Mật khẩu là trường bắt buộc'
  })
});

const Signin = () => {
  const navigate = useNavigate();
  const [, setUser] = useLocalStorage('user', {});
  const { register, handleSubmit, formState: { errors } } = useForm<Auth>({
    resolver: joiResolver(schema)
  });

  const { mutate } = useMutation({
    mutationFn: async (formData: Auth) => {
      const { data } = await axios.post('http://localhost:8080/api/v1/auth/signin', formData);
      return data;
    },
    onSuccess: (data) => {
      setUser(data);
      toast.success('Đăng nhập thành công!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: false, // Ẩn hình ảnh thông báo
      });
      setTimeout(() => {
        navigate('/');
      }, 3000); // Chuyển hướng sau 3 giây
    },
    onError: (error) => {
      toast.error('Đăng nhập thất bại. Vui lòng thử lại!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: false, // Ẩn hình ảnh thông báo
      });
      console.log(error);
    }
  });

  const onSubmit = (formData: Auth) => {
    mutate(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              {...register('email')}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              {...register('password')}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Mật khẩu"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;