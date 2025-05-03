const mongoose = require("mongoose");

// Product Schema
const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        productCode: { type: String, required: true, unique: true },
        batchNumber: { type: String, required: true },
        sku: { type: String, required: true, unique: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
        description: { type: String },
        images: [{ type: String }], // Array of image URLs
        mrp: { type: Number, required: true },
        wholesalePrice: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        stockQuantity: { type: Number, required: true },
        manufacturingDate: { type: Date },
        expiryDate: { type: Date, required: true },
        tax: {
            gstType: { type: String, enum: ["cgst_sgst", "igst"], required: true },
            cgst: { type: Number, default: 0 },
            sgst: { type: Number, default: 0 },
            igst: { type: Number, default: 0 },
        },
        finalPrice: { type: Number, required: true },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
