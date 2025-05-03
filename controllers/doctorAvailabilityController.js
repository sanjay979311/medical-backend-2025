import DoctorAvailability from '../models/doctorAvailabilityModel.js';
import mongoose from 'mongoose';


export const getAvailabilityList = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ensures comparison starts from midnight (start of today)

        // Perform both count and find in parallel using Promise.all for efficiency
        const [response, count] = await Promise.all([
            DoctorAvailability.find({
                availableDate: { $gt: today }
            })
                .populate({
                    path: "doctorId",
                    model: "User",
                    select: "fullName"
                })
                .sort({ createdAt: -1 }),
            DoctorAvailability.countDocuments({
                availableDate: { $gt: today }
            })
        ]);

        return res.status(200).json({
            count: count, // Directly get the count without relying on array length
            data: response
        });
    } catch (error) {
        console.error("Error fetching availability list:", error);
        return res.status(500).json({ message: "Unable to retrieve doctor availability list." });
    }
};


export const saveAvailability = async (req, res) => {
    try {
        const { doctorId, availableDate, slots } = req.body;

        console.log("body is ", req.body)

        if (!doctorId || !availableDate || !slots) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const formattedDate = new Date(availableDate);
        formattedDate.setHours(0, 0, 0, 0); // Normalize time

        let existingAvailability = await DoctorAvailability.findOne({
            doctorId,
            availableDate: formattedDate,
        });

        if (existingAvailability) {
            existingAvailability.slots = slots;
            await existingAvailability.save();
            return res.status(200).json({ message: "Availability updated successfully" });
        } else {
            const newAvailability = new DoctorAvailability({
                doctorId,
                availableDate: formattedDate,
                slots,
            });
            await newAvailability.save();
            return res.status(201).json({ message: "Availability created successfully" });
        }
    } catch (error) {
        console.error("Error saving availability:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get availability for a doctor on a specific date
export const getAvailabilityByDate = async (req, res) => {
    try {
        const { doctorId, date } = req.params;

        if (!doctorId || !date) {
            return res.status(400).json({ message: "Missing doctorId or date" });
        }

        const queryDate = new Date(date);
        queryDate.setHours(0, 0, 0, 0); // Normalize time

        const availability = await DoctorAvailability.findOne({
            doctorId,
            availableDate: queryDate,
        });

        if (!availability) {
            return res.status(404).json({ message: "No availability found" });
        }

        res.status(200).json(availability);
    } catch (error) {
        console.error("Error fetching availability:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




export const getAvailabilityById = async (req, res) => {
    try {
        const { id } = req.params;
        const availability = await DoctorAvailability.findById(id); // or use .findOne({ _id: id })

        if (!availability) {
            return res.status(404).json({ message: 'Availability not found' });
        }

        res.json(availability);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch availability', error: err.message });
    }
};



// PUT /api/availability/:id
export const updateAvailability = async (req, res) => {
    const { id } = req.params;
    const { doctorId, availableDate, slots } = req.body;

    try {
        const existingAvailability = await DoctorAvailability.findById(id);
        if (!existingAvailability) {
            return res.status(404).json({ error: "Availability not found." });
        }

        // Optional: Check if doctor exists (if needed in your logic)

        existingAvailability.doctorId = doctorId;
        existingAvailability.availableDate = new Date(availableDate);
        existingAvailability.slots = {
            morning: slots.morning || [],
            afternoon: slots.afternoon || [],
            evening: slots.evening || [],
        };

        const updated = await existingAvailability.save();

        res.status(200).json({ message: "Availability updated successfully.", data: updated });
    } catch (err) {
        console.error("Error updating availability:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};


export const getAvailability = async (req, res) => {
    // console.log("get dockter is ==========>", req.params)
    try {
        const { doctorId } = req.params;
        // console.log("get dockter is ==========>", req.params)
        const availability = await DoctorAvailability.find({ doctorId });
        res.json(availability);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch availability', error: err });
    }
};

// export const getDoctorsByid = async (req, res) => {

//    const doctorId =  mongoose.Types.ObjectId()
//     console.log("get dockter is ==========>", req.params)
//     try {
//         const { doctorId } = req.params;
//         // console.log("get dockter is ==========>", req.params)
//         const availability = await DoctorAvailability.find({ doctorId });
//         res.json(availability);
//     } catch (err) {
//         res.status(500).json({ message: 'Failed to fetch availability', error: err });
//     }
// };

export const getDoctorsByid = async (req, res) => {
    // console.log("get doctor is ==========>", req.params);

    try {
        const { doctorId } = req.params;
        // Ensure doctorId is converted to a valid ObjectId
        const availability = await DoctorAvailability.find(
            { doctorId: new mongoose.Types.ObjectId(doctorId) },
            '_id availableDate' // Select only _id and availableDate fields
        );


        // If no availability found, return a 404 response
        if (!availability || availability.length === 0) {
            return res.status(200).json([]);
        }

        res.json(availability);
    } catch (err) {
        console.error("Error fetching availability: ", err);
        res.status(500).json({ message: 'Failed to fetch availability', error: err.message });
    }
};
// POST new availability for doctor
export const createAvailability = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { date, slots } = req.body;

        const exists = await DoctorAvailability.findOne({ doctorId, date });
        if (exists) return res.status(400).json({ message: 'Availability already exists for this date' });

        const newAvailability = new DoctorAvailability({ doctorId, date, slots });
        await newAvailability.save();
        res.status(201).json(newAvailability);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create availability', error: err });
    }
};

// DELETE availability
export const deleteAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        await DoctorAvailability.findByIdAndDelete(id);
        res.json({ message: 'Availability deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete availability', error: err });
    }
};

