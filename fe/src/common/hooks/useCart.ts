import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalStorage } from './useStorage';
import axios from 'axios';
import { debounce, reduce } from 'lodash';
import { ChangeEvent, useState } from 'react';

const useCart = () => {
  const queryClient = useQueryClient();
  const [user] = useLocalStorage('user', {});
  const userId = user?.user?._id;
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const { data, ...restQuery } = useQuery({
    queryKey: ['cart', userId],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:8080/api/v1/carts/${userId}`);
      // Initialize quantities state
      const initialQuantities = data.products.reduce((acc: any, product: any) => {
        acc[product.productId] = product.quantity;
        return acc;
      }, {});
      setQuantities(initialQuantities);
      return data;
    },
  });

  const updateQuantityDebounce = debounce(async (productId, quantity: number) => {
    await axios.post(`http://localhost:8080/api/v1/carts/update`, {
      userId,
      productId,
      quantity,
    });
    queryClient.invalidateQueries({
      queryKey: ['cart', userId],
    });
  }, 300);

  const { mutate } = useMutation({
    mutationFn: async ({ action, productId }: { action: string; productId: string }) => {
      switch (action) {
        case 'INCREMENT':
          await axios.post(`http://localhost:8080/api/v1/carts/increase`, {
            userId,
            productId,
          });
          break;
        case 'DECREMENT':
          await axios.post(`http://localhost:8080/api/v1/carts/decrease`, {
            userId,
            productId,
          });
          break;
        case 'REMOVE':
          await axios.post(`http://localhost:8080/api/v1/carts/remove`, {
            userId,
            productId,
          });
          break;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart', userId],
      });
    },
  });

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
    updateQuantityDebounce(productId, quantity);
  };

  const handleInputChange = (productId: string, e: ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value);
    if (!isNaN(quantity) && quantity > 0) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: quantity,
      }));
    }
  };

  const handleInputBlur = (productId: string, e: ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value);
    if (!isNaN(quantity) && quantity > 0) {
      handleQuantityChange(productId, quantity);
    }
  };

  const handleInputKeyDown = (productId: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const quantity = parseInt((e.target as HTMLInputElement).value);
      if (!isNaN(quantity) && quantity > 0) {
        handleQuantityChange(productId, quantity);
      }
    }
  };

  const calculateTotalPrice = () => {
    if (!data || !data.products) return 0;
    return reduce(data.products, (total, product) => total + product.price * product.quantity, 0);
  };

  return {
    data,
    mutate,
    calculateTotalPrice,
    handleQuantityChange,
    handleInputChange,
    handleInputBlur,
    handleInputKeyDown,
    quantities,
    ...restQuery,
  };
};

export default useCart;