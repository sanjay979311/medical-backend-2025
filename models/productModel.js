// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: true,
//             trim: true,
//         },
//         description: {
//             type: String,
//             required: true,
//         },
//         price: {
//             type: Number,
//             required: true,
//         },
//         category: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Category",
//             required: true,
//         },
//         subCategory: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "SubCategory",
//             required: true,
//         },
//         stock: {
//             type: Number,
//             required: true,
//             default: 0,
//         },
//         images: [
//             {
//                 url: String,
//             },
//         ],
//         createdAt: {
//             type: Date,
//             default: Date.now,
//         },
//     },
//     { timestamps: true }
// );

// const Product = mongoose.model("Product", productSchema);
// export default Product;


import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        // productCode: {
        //     type: String,
        //     required: [true, "Product code is required"],
        //     unique: true,
        //     trim: true,
        // },
        productCode: {
            type: String,
            required: [true, "Product code is required"],
            unique: true,
            trim: true,
        },
        costPrice: {
            type: Number,
            required: [true, "Cost price is required"],
            min: 0,
        },
        price: {
            type: Number,
            required: [true, "Selling price is required"],
            min: 0,
        },
        mrp: {
            type: Number,
            required: [true, "MRP is required"],
            min: 0,
        },
        maxDiscount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
        },
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory",
            required: [true, "Sub-category is required"],
        },
        stock: {
            type: Number,
            default: 0,
            min: 0,
        },
        batchNumber: {
            type: String,
            trim: true,
        },
        barcode: {
            type: String,
            trim: true,
        },
        manufacturingDate: {
            type: Date,
        },
        expiryDate: {
            type: Date,
        },
        isTaxable: {
            type: Boolean,
            default: true,
        },
        cgst: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        sgst: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        igst: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        shipping: {
            cost: {
                type: Number,
                default: 0,
                min: 0,
            },
            isFreeShipping: {
                type: Boolean,
                default: false,
            },
        },
        images: [
            {
                url: String,
            },
        ],

    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
