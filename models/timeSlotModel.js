import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// TimeSlot Schema
const timeSlotSchema = new Schema({
    date: { type: String, required: true }, // Format: 'Thu, 24 Apr'
    dateValue: { type: String, required: true }, // '2023-04-24'
    availableSlots: { type: Number, required: true },
    sessions: {
        morning: [String], // Array of available time slots for the morning
        afternoon: [String], // Array of available time slots for the afternoon
        evening: [String], // Array of available time slots for the evening
    },
}, { timestamps: true });

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);
export default TimeSlot;



// import mongoose from 'mongoose';

// const doctorAvailabilitySchema = new mongoose.Schema(
//     {
//         doctorId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//             required: true,
//         },

//         date: {
//             type: String, // Format: 'YYYY-MM-DD'
//             required: true,
//         },

//         displayDate: {
//             type: String, // Format: 'Fri, 19 Apr'
//         },

//         availableSlots: {
//             type: Number,
//             default: 0,
//         },

//         sessions: {
//             morning: {
//                 type: [String], // Example: ['09:00 AM', '09:30 AM']
//                 default: [],
//             },
//             afternoon: {
//                 type: [String],
//                 default: [],
//             },
//             evening: {
//                 type: [String],
//                 default: [],
//             },
//         },

//     },
//     {
//         timestamps: true, // adds createdAt and updatedAt
//     }
// );

// export default mongoose.model('DoctorAvailability', doctorAvailabilitySchema);
