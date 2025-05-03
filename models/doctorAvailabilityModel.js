
// const mongoose = require("mongoose");

// const doctorAvailabilitySchema = new mongoose.Schema({
//     // Reference to the doctor (User model)
//     doctorId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',  // Assuming "User" model holds doctor data
//         required: true,
//     },

//     // Store the date as a Date object (better for querying)
//     availableDate: {
//         type: Date,  // Change from String to Date for better querying and operations
//         required: true
//     },

//     // Active status for availability
//     isActive: {
//         type: Boolean,
//         default: true,  // Indicates whether the availability is active or inactive
//     },

//     // Store available slots (morning, afternoon, evening)
//     slots: {
//         morning: [String],   // Array of strings for morning slots
//         afternoon: [String], // Array of strings for afternoon slots
//         evening: [String],   // Array of strings for evening slots
//     }
// }, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

// // Export the model with a meaningful name
// module.exports = mongoose.model('DoctorAvailability', doctorAvailabilitySchema);



import mongoose from 'mongoose';


const slotSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
});

const doctorAvailabilitySchema = new mongoose.Schema(
    {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        availableDate: {
            type: Date,
            required: true,
        },
        slots: {
            morning: [slotSchema],
            afternoon: [slotSchema],
            evening: [slotSchema],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const DoctorAvailability = mongoose.model('DoctorAvailability', doctorAvailabilitySchema);
export default DoctorAvailability;


// export default model('Category', categorySchema);  // Use export default
