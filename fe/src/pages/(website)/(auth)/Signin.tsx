import { useLocalStorage } from '@/common/hooks/useStorage'
import { joiResolver } from '@hookform/resolvers/joi'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import Joi from 'joi'
import { useForm } from 'react-hook-form'

const signinSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .min(3)
        .required(),
    password: Joi.string().min(6).required()
})

const Signin = () => {
    const [, setUser] = useLocalStorage('user', {})
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: joiResolver(signinSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const { mutate } = useMutation({
        mutationFn: async (formData: { email: string; password: string }) => {
            const { data } = await axios.post('http://localhost:8080/api/v1/auth/signin', formData)
            return data
        },
        onSuccess: (data) => setUser(data),
        onError: (error) => console.log(error)
    })

    const onSubmit = (formData: { email: string; password: string }) => {
        mutate(formData)
    }
    return (
        <div className='container'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type='text' {...register('email', { required: true, minLength: 3 })} placeholder='Email' />
                {errors.email && <p>{errors.email.message}</p>}
                <input
                    type='password'
                    {...register('password', { required: true, minLength: 6 })}
                    placeholder='Password'
                />
                {errors.password && <p>{errors.password.message}</p>}
                <button>Đăng nhập</button>
            </form>
        </div>
    )
}

export default Signin
