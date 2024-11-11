export interface ICategory {
    _id: string;
    name: string;
}

export interface IProduct {
    _id?: number | string;
    image: string;
    name: string;
    slug: string;
    category?: ICategory;
    price: number;
    gallery: string[];
    description: string;
    discount: number;
    featured: boolean;
    countInStock: number;
    tags: string[];
    attributes: any[];
    createdAt?: string;
    updatedAt?: string;
    quantity?: number;
}
