

// // import { Schema, model } from 'mongoose'; // Use import for mongoose

// // const userSchema = new Schema({
// //     fullName: {
// //         type: String,
// //         required: true
// //     },
// //     email: {
// //         unique: true,
// //         type: String,
// //         required: true
// //     },
// //     password: {
// //         type: String,
// //         required: true
// //     },
// //     mobileNo: {
// //         type: String,
// //         required: true
// //     },
// //     gst_number: {
// //         type: String,
// //         required: true
// //     },
// //     address: {
// //         type: String,
// //         required: true
// //     },
// //     city: {
// //         type: String,
// //         required: false
// //     },
// //     state: {
// //         type: String,
// //         required: false
// //     },
// //     image: {
// //         type: String,
// //     },
// //     role: {
// //         type: String,
// //         enum: ['customer', 'employee', 'admin'],
// //         default: 'customer',
// //     },
// // });

// // export default model('User', userSchema);  // Use export default


// import { Schema, model } from 'mongoose';

// const userSchema = new Schema({
//     fullName: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,   // Fixed order (type first, then unique)
//         unique: true,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     mobileNo: {
//         type: String,
//         required: true
//     },
//     gst_number: {
//         type: String,
//         required: false
//     },
//     address: {
//         type: String,
//         required: true
//     },


//     city: { type: Schema.Types.ObjectId, ref: "City" }, // Reference to City collection
//     state: { type: Schema.Types.ObjectId, ref: "State" }, // Reference to State collection

//     image: {
//         type: String
//     },
//     role: {
//         type: String,
//         enum: ['patient', 'doctor', 'admin'],
//         default: 'patient'
//     },
// }, { timestamps: true });  // ✅ Adds createdAt & updatedAt fields

// export default model('User', userSchema);



import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address']
    },
    mobileNo: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number']
    },

    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: null // Optional, can be null or required
    },

    isActive: {
        type: Boolean,
        default: true, // or false if activation by admin/email verification is required
    },
    dob: {
        type: Date
    },
    blood_group: {
        type: String,
        enum: ['', 'O+', 'A+', 'B+', 'O-', 'A-', 'B-', 'AB+', 'AB-'],
        default: ''
    },
    timezone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    locality: {
        type: String,
        default: ''
    },

    city: {
        type: Schema.Types.ObjectId,
        ref: 'City',
        required: false,
    },
    state: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        required: false,
    },
    country: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        required: false
    },
    pincode: {
        type: String,
        default: ''
    },
    specialization: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
    },
    qualification: {
        type: String,
        default: ''
    },
    experience: {
        type: Number, // In years
        default: 0,
    },

    extra_phone_numbers: {
        type: String,
        default: ''
    },
    profile_picture: {
        type: String,
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        default: 'patient'
    },
    appointmentFee: {
        type: Number,
        default: 500, // Default consultation fee of ₹500
    },
    language: {
        type: String,
        default: 'hi', // Default language is English
    },
}, { timestamps: true });

export default model('User', userSchema);
