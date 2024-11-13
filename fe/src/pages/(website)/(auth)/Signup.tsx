
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@/common/types/auth';
import { useLocalStorage } from '@/common/hooks/useStorage';

const schema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Tên không được để trống',
    'any.required': 'Tên là trường bắt buộc'
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Email không hợp lệ',
    'string.empty': 'Email không được để trống',
    'any.required': 'Email là trường bắt buộc'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Mật khẩu là trường bắt buộc'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Mật khẩu xác nhận không khớp',
    'string.empty': 'Mật khẩu xác nhận không được để trống',
    'any.required': 'Mật khẩu xác nhận là trường bắt buộc'
  })
});

const Signup = () => {
  const navigate = useNavigate();
  const [, setUser] = useLocalStorage('user', {});
  const { register, handleSubmit, formState: { errors } } = useForm<Auth>({
    resolver: joiResolver(schema)
  });

  const { mutate } = useMutation({
    mutationFn: async (formData: Auth) => {
      const { data } = await axios.post('http://localhost:8080/api/v1/auth/signup', formData);
      return data;
    },
    onSuccess: (data) => {
      setUser(data);
      navigate('/signin'); // Chuyển hướng sang trang đăng nhập sau khi đăng ký thành công
    },
    onError: (error) => console.log(error)
  });

  const onSubmit = (formData: Auth) => {
    mutate(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Đăng ký</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Tên
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Tên"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
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
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword')}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Xác nhận mật khẩu"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;