/* eslint-disable @typescript-eslint/no-explicit-any */
import Catergories from '@/pages/(website)/product/_components/CategoryList';
import { useProductQuery } from '@/common/hooks/useProductQuery';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductList from '@/pages/(website)/product/_components/ProductList';

const ShopPage = () => {
    const [params] = useSearchParams();
    const page = params.get('page');

    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(page || 1);

    const { data, isLoading, refetch } = useProductQuery({ _page: page, _limit: limit });
    useEffect(() => {
        if (page && +page !== currentPage) {
            setCurrentPage(+page);
        }
    }, [page, currentPage]);

    const handleLimitChange = (event: ChangeEvent<any>) => {
        setLimit(event.target.value);
        refetch(); // Gọi lại API với limit mới và trang đầu tiên
    };

    const { data: products, pagination } = data || { data: [], pagination: {} };
    if (isLoading) return <div>...Loading</div>;

    return (
        <div className="container mx-auto p-4">
            <Catergories />
            <hr className="my-4" />
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="limit" className="text-gray-700">Show:</label>
                            <select
                                id="limit"
                                onChange={handleLimitChange}
                                defaultValue={limit}
                                className="border border-gray-300 rounded px-2 py-1"
                            >
                                <option value="2">2</option>
                                <option value="4">4</option>
                                <option value="6">6</option>
                                <option value="10">10</option>
                            </select>
                        </div>
                    </div>
                    <ProductList products={products} pagination={pagination} />
                </>
            )}
        </div>
    );
};

export default ShopPage;