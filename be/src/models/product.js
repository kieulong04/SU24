import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        image: {
            type: String,
        },
        gallery: {
            type: [String], // Định nghĩa gallery là một mảng các chuỗi
        },
        description: {
            type: String,
        },
        discount: {
            type: Number,
            default: 0,
        },
        countInStock: {
            type: Number,
            default: 0,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        tags: {
            type: [String], // Định nghĩa tags là một mảng các chuỗi
        },
        attributes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Attribute",
            },
        ],
    },
    { timestamps: true, versionKey: false }
);

productSchema.plugin(mongoosePaginate);
export default mongoose.model("Product", productSchema);