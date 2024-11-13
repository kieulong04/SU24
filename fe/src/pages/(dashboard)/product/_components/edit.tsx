import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [featured, setFeatured] = useState(false);
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [attributes, setAttributes] = useState<{ _id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);

  useEffect(() => {
    // Fetch categories and attributes from API
    axios.get('http://localhost:8080/api/v1/categories').then(response => {
      setCategories(response.data);
    }).catch(error => {
      console.error('Error fetching categories:', error);
    });

    axios.get('http://localhost:8080/api/v1/attributes').then(response => {
      setAttributes(response.data);
    }).catch(error => {
      console.error('Error fetching attributes:', error);
    });

    // Fetch product data by ID
    axios.get(`http://localhost:8080/api/v1/products/${id}`).then(response => {
      const product = response.data;
      setProductName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setDiscount(product.discount);
      setCountInStock(product.countInStock);
      setFeatured(product.featured);
      setTags(product.tags);
      setSelectedCategory(product.category._id);
      setSelectedAttributes(product.attributes.map((attr: any) => attr._id));
      setCurrentImage(product.image);
      setCurrentGallery(product.gallery);
    }).catch(error => {
      console.error('Error fetching product:', error);
    });
  }, [id]);

  const handleEditProduct = () => {
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('slug', productName.toLowerCase().replace(/ /g, '-'));
    formData.append('category', selectedCategory);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('discount', discount);
    formData.append('countInStock', countInStock);
    formData.append('featured', featured.toString());
    formData.append('tags', tags);
    if (image) {
      formData.append('image', image);
    }
    gallery.forEach((file) => {
      formData.append('gallery', file);
    });

    const attributesString = selectedAttributes.join(',');
    formData.append('attributes', attributesString);

    // Send updated product to API
    axios.put(`http://localhost:8080/api/v1/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log('Product updated:', response.data);
        navigate('/admin/products'); // Navigate to the product list page
      })
      .catch(error => {
        console.error('There was an error updating the product!', error);
      });
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Chỉnh Sửa Sản Phẩm</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">
          Tên Sản Phẩm
        </label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
          Giá
        </label>
        <input
          type="text"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Mô Tả
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discount">
          Giảm Giá
        </label>
        <input
          type="text"
          id="discount"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="countInStock">
          Số Lượng Trong Kho
        </label>
        <input
          type="text"
          id="countInStock"
          value={countInStock}
          onChange={(e) => setCountInStock(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="mr-2 leading-tight"
        />
        <label className="block text-gray-700 text-sm font-bold" htmlFor="featured">
          Nổi Bật
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
          Hình Ảnh
        </label>
        {currentImage && (
          <div className="mb-2">
            <img src={`http://localhost:8080/${currentImage}`} alt="Current" className="w-32 h-32 object-cover" />
          </div>
        )}
        <input
          type="file"
          id="image"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gallery">
          Thư Viện Ảnh
        </label>
        {currentGallery.length > 0 && (
          <div className="mb-2 flex flex-wrap">
            {currentGallery.map((img, index) => (
              <img key={index} src={`http://localhost:8080/${img}`} alt={`Gallery ${index}`} className="w-32 h-32 object-cover mr-2 mb-2" />
            ))}
          </div>
        )}
        <input
          type="file"
          id="gallery"
          multiple
          onChange={(e) => setGallery(e.target.files ? Array.from(e.target.files) : [])}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
          Danh Mục
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attributes">
          Thuộc Tính
        </label>
        <select
          id="attributes"
          multiple
          value={selectedAttributes}
          onChange={(e) => setSelectedAttributes(Array.from(e.target.selectedOptions, option => option.value))}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {attributes.map(attribute => (
            <option key={attribute._id} value={attribute._id}>
              {attribute.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleEditProduct}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Cập Nhật Sản Phẩm
      </button>
    </div>
  );
};

export default EditProduct;