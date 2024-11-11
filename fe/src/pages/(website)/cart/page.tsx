/* eslint-disable @typescript-eslint/no-explicit-any */

import useCart from '@/common/hooks/useCart'
import { ChangeEvent } from 'react'

const CartPage = () => {
    const { data, mutate, handleQuantityChange, calculateTotal, isLoading, isError } = useCart()
    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error</p>

    return (
        <div className='container'>
            <table className='w-full'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng giá</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data?.products.map((product: any, index: number) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td className='border-2'>{product.name}</td>
                                <td className='border-2'>{product.price}</td>
                                <td className='border-2'>
                                    <button
                                        className='py-2 px-4 bg-slate-400'
                                        onClick={() =>
                                            mutate({
                                                action: 'DECREMENT',
                                                productId: product.productId
                                            })
                                        }
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth={1.5}
                                            stroke='currentColor'
                                            className='w-6 h-6'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='m19.5 8.25-7.5 7.5-7.5-7.5'
                                            />
                                        </svg>
                                    </button>
                                    {product.quantity}
                                    <input
                                        type='number'
                                        className='border border-red-100'
                                        onInput={(e) =>
                                            handleQuantityChange(product.productId, e as ChangeEvent<HTMLInputElement>)
                                        }
                                    />
                                    <button
                                        className='py-2 px-4 bg-emerald-400'
                                        onClick={() =>
                                            mutate({
                                                action: 'INCREMENT',
                                                productId: product.productId
                                            })
                                        }
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth={1.5}
                                            stroke='currentColor'
                                            className='w-6 h-6'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='m4.5 15.75 7.5-7.5 7.5 7.5'
                                            />
                                        </svg>
                                    </button>
                                </td>
                                <td className='border-2'>{product.price * product.quantity}</td>
                                <td className='border-2'>
                                    <button
                                        className='py-2 px-4 bg-red-500 text-white rounded-sm'
                                        onClick={() =>
                                            mutate({
                                                action: 'REMOVE',
                                                productId: product.productId
                                            })
                                        }
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <p>Total: ${calculateTotal()}</p>
        </div>
    )
}

export default CartPage
