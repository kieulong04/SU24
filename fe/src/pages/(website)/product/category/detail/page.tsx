import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProductList from '../../_components/ProductList';

const CategoryDetail = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useQuery({
        queryKey: ['CATEGORY_DETAIL', id],
        queryFn: async () => {
            const { data } = await axios.get(`http://localhost:8080/api/v1/categories/${id}`);
            return data;
        }
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading category details</p>;

    return (
        <div className="container mx-auto p-8">
            <section className="news">
                <div className="container">
                    <div className="section-heading mb-8">
                        <h2 className="section-heading__title text-3xl font-bold">Danh mục: {data.category.name}</h2>
                    </div>
                    <ProductList products={data.products} />
                </div>
            </section>
        </div>
    );
};

export default CategoryDetail;