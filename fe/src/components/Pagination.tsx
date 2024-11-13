import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

type PaginationProps = {
    totalPages: number;
};

const Pagination: React.FC<PaginationProps> = ({ totalPages }) => {
    const [params] = useSearchParams();
    const page = params.get('page');
    return (
        <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
                <Link
                    key={i + 1}
                    to={`?page=${i + 1}`}
                    className={`px-4 py-2 border rounded ${parseInt(page || '1') === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white'}`}
                >
                    {i + 1}
                </Link>
            ))}
        </div>
    );
};

export default Pagination;