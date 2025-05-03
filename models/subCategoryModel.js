// import { Schema, model } from 'mongoose'; // Use import for mongoose

// const subCategorySchema = new Schema({
//     name: { type: String, required: true, unique: true },
//     slug: { type: String, required: true, unique: true },
//     description: { type: String } // Added the missing description field
// });

// export default model('SubCategory', subCategorySchema);  // Use export default

import { Schema, model } from 'mongoose';

const subCategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to parent category
    description: { type: String }, // Optional description field
}, { timestamps: true }); // Add createdAt and updatedAt fields

export default model('SubCategory', subCategorySchema);