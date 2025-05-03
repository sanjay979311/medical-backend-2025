// import express from 'express';
// import { createTimeSlot, getTimeSlots, getTimeSlotByDate, updateTimeSlot, deleteTimeSlot } from '../controllers/timeSlotController';


// const router = express.Router();

// // Route to create a new time slot
// router.post('/time-slot', createTimeSlot);

// // Route to get all time slots
// router.get('/time-slots', getTimeSlots);

// // Route to get a specific time slot by dateValue
// router.get('/time-slot/:dateValue', getTimeSlotByDate);

// // Route to update an existing time slot
// router.put('/time-slot/:dateValue', updateTimeSlot);

// // Route to delete a time slot
// router.delete('/time-slot/:dateValue', deleteTimeSlot);

// export default router;



import express from 'express';
import { createTimeSlot, getTimeSlotsList, getTimeSlots, getById, getTimeSlotByDate, updateTimeSlot, deleteTimeSlot } from '../controllers/timeSlotController.js';

const router = express.Router();

// Route to create a new time slot
router.post('/', createTimeSlot);
router.get('/list', getTimeSlotsList);
// Route to get all time slots
router.get('/', getTimeSlots);

// Route to get a specific time slot by dateValue
router.get('/:dateValue', getTimeSlotByDate);
router.get('/get-by-id/:id', getById);

// Route to update an existing time slot by dateValue
router.put('/:dateValue', updateTimeSlot);


// Route to delete a time slot by dateValue
router.delete('/:id', deleteTimeSlot);
// router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteCity);

export default router;

