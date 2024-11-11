import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import Product from "../models/product";

// Lấy đường dẫn hiện tại và chuyển đổi thành đường dẫn thư mục
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const create = async (req, res) => {
    try {
        const { name, slug, category, price, description, discount, countInStock, featured, tags, attributes } = req.body;

        // Kiểm tra xem slug đã tồn tại hay chưa
        const existingProduct = await Product.findOne({ slug });
        if (existingProduct) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Slug already exists" });
        }

        // Kiểm tra và chuyển đổi category thành ObjectId
        const categoryId = mongoose.isValidObjectId(category) ? new mongoose.Types.ObjectId(category) : null;
        if (!categoryId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid category ID" });
        }

        // Kiểm tra và chuyển đổi attributes thành ObjectId
        let attributeIds = [];
        if (Array.isArray(attributes)) {
            attributeIds = attributes.map(attr => {
                return mongoose.isValidObjectId(attr) ? new mongoose.Types.ObjectId(attr) : null;
            });
            if (attributeIds.includes(null)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid attribute ID" });
            }
        } else if (typeof attributes === 'string') {
            attributeIds = attributes.split(',').map(attr => {
                return mongoose.isValidObjectId(attr.trim()) ? new mongoose.Types.ObjectId(attr.trim()) : null;
            });
            if (attributeIds.includes(null)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid attribute ID" });
            }
        }

        // Tạo sản phẩm mới
        const product = new Product({
            name,
            slug,
            category: categoryId,
            price,
            description,
            discount,
            countInStock,
            featured,
            tags,
            attributes: attributeIds
        });

        // Lưu đường dẫn tệp vào image và gallery
        if (req.files && req.files.image) {
            product.image = `uploads/${req.files.image[0].filename}`;
        }
        if (req.files && req.files.gallery) {
            req.files.gallery.forEach(file => {
                product.gallery.push(`uploads/${file.filename}`);
            });
        }

        const newProduct = await product.save();
        return res.status(StatusCodes.CREATED).json(newProduct);
    } catch (error) {
        console.error(error); // Log lỗi chi tiết
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    const { _page = 1, _limit = 10, _sort = "createdAt", _order = "asc", _expand } = req.query;
    const options = {
        page: _page,
        limit: _limit,
        sort: { [_sort]: _order === "desc" ? -1 : 1 },
    };
    const populateOptions = [
        { path: "category", select: "name" },
        {
            path: 'attributes',
            populate: {
                path: 'values',
                model: 'ValueAttribute',
                select: 'name'
            }
        }
    ];
    try {
        const result = await Product.paginate(
            {},
            { ...options, populate: populateOptions }
        );
        if (result.docs.length === 0) throw new Error("No products found");
        const response = {
            data: result.docs,
            pagination: {
                currentPage: result.page,
                totalPages: result.totalPages,
                totalItems: result.totalDocs,
            },
        };
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name') // Populate category name
            .populate({
                path: 'attributes',
                populate: {
                    path: 'values',
                    model: 'ValueAttribute',
                    select: 'name'
                }
            });
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy sản phẩm nào!" });
        }
        return res.status(StatusCodes.OK).json(product);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const deleteProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Product not found" });
        }

        // Xóa ảnh và gallery
        if (product.image) {
            const imagePath = path.join(__dirname, '../', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            } else {
                console.error(`Image file not found: ${imagePath}`);
            }
        }
        if (product.gallery) {
            product.gallery.forEach(file => {
                const galleryPath = path.join(__dirname, '../', file);
                if (fs.existsSync(galleryPath)) {
                    fs.unlinkSync(galleryPath);
                } else {
                    console.error(`Gallery file not found: ${galleryPath}`);
                }
            });
        }

        return res.status(StatusCodes.OK).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

export const updateProductById = async (req, res) => {
    try {
        const { name, slug, category, price, description, discount, countInStock, featured, tags, attributes } = req.body;

        // Tìm sản phẩm cần cập nhật
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Product not found" });
        }

        // Cập nhật thông tin sản phẩm
        product.name = name;
        product.slug = slug;
        product.category = mongoose.Types.ObjectId(category); // Chuyển đổi category thành ObjectId
        product.price = price;
        product.description = description;
        product.discount = discount;
        product.countInStock = countInStock;
        product.featured = featured;
        product.tags = tags;
        product.attributes = attributes.map(attr => mongoose.Types.ObjectId(attr)); // Chuyển đổi attributes thành ObjectId

        // Xóa ảnh cũ nếu có ảnh mới
        if (req.files && req.files.image) {
            if (product.image) {
                fs.unlinkSync(path.join(__dirname, '../', product.image));
            }
            product.image = path.posix.join('uploads', req.files.image[0].filename);
        }

        // Xóa gallery cũ nếu có ảnh mới
        if (req.files && req.files.gallery) {
            product.gallery.forEach(file => {
                fs.unlinkSync(path.join(__dirname, '../', file));
            });
            product.gallery = []; // Xóa gallery cũ
            req.files.gallery.forEach(file => {
                product.gallery.push(path.posix.join('uploads', file.filename));
            });
        }

        const updatedProduct = await product.save();
        return res.status(StatusCodes.OK).json(updatedProduct);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const related = async (req, res) => {
    try {
        const product = await Product.find({
            category: req.params.categoryId,
            _id: { $ne: req.params.productId },
        });
        return res.status(StatusCodes.OK).json(product);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};