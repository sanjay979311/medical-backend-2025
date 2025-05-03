// const TimeSlot = require('../models/timeSlotModel.js');

import TimeSlot from "../models/timeSlotModel.js"; // Sale Entry model

// Create a new time slot
export const createTimeSlot = async (req, res) => {

    try {
        const { date, dateValue, availableSlots, sessions } = req.body;

        console.log("request body =======>", req.body)

        const newTimeSlot = new TimeSlot({
            date,
            dateValue,
            availableSlots,
            sessions,
        });

        await newTimeSlot.save();
        return res.status(201).json({ message: 'Time Slot Created Successfully', data: newTimeSlot });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating time slot', error: error.message });
    }
};

export const getTimeSlotsList = async (req, res) => {
    try {

        const timeSlots = await TimeSlot.find().sort({ dateValue: 1 })


        return res.status(200).json(timeSlots);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching time slots', error: error.message });
    }
};
// Get all time slots
export const getTimeSlots = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // "2025-04-19"
        const timeSlots = await TimeSlot.find({
            dateValue: { $gte: today }
        }).sort({ dateValue: 1 })


        return res.status(200).json(timeSlots);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching time slots', error: error.message });
    }
};

export const getById = async (req, res) => {
    try {
        // Extract the id from the URL parameter
        const { id } = req.params;

        // Fetch the TimeSlot by its ID
        const timeSlot = await TimeSlot.findById(id);

        // Check if the TimeSlot exists
        if (!timeSlot) {
            return res.status(404).json({ message: 'TimeSlot not found' });
        }

        // Return the found TimeSlot
        return res.json(timeSlot);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while fetching the TimeSlot' });
    }
};
// Get a specific time slot by dateValue
export const getTimeSlotByDate = async (req, res) => {
    const { dateValue } = req.params;

    try {
        const timeSlot = await TimeSlot.findOne({ dateValue });
        if (!timeSlot) {
            return res.status(404).json({ message: 'Time slot not found' });
        }
        return res.status(200).json(timeSlot);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching time slot', error: error.message });
    }
};

// Update an existing time slot
export const updateTimeSlot = async (req, res) => {
    const { dateValue } = req.params;
    const { availableSlots, sessions } = req.body;

    try {
        const updatedTimeSlot = await TimeSlot.findOneAndUpdate(
            { dateValue },
            { availableSlots, sessions },
            { new: true }
        );

        if (!updatedTimeSlot) {
            return res.status(404).json({ message: 'Time slot not found' });
        }

        return res.status(200).json({ message: 'Time slot updated successfully', data: updatedTimeSlot });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating time slot', error: error.message });
    }
};

// Delete a time slot
export const deleteTimeSlot = async (req, res) => {
    // console.log("req.params =>", req.params)
    // const { id } = req.params;


    try {
        const deletedTimeSlot = await TimeSlot.findOneAndDelete({ _id: req.params.id });

        if (!deletedTimeSlot) {
            return res.status(404).json({ message: 'Time slot not found' });
        }

        return res.status(200).json({ message: 'Time slot deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting time slot', error: error.message });
    }
};

