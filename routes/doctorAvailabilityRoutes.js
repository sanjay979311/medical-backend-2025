import express from 'express';
import {
    getAvailability,
    createAvailability,
    deleteAvailability,
    saveAvailability,
    getAvailabilityList,
    getAvailabilityByDate,
    getAvailabilityById,
    updateAvailability,
    getDoctorsByid


} from '../controllers/doctorAvailabilityController.js';

const router = express.Router();


// Save or update availability
router.post("/save-availability", saveAvailability);

// Get availability by doctor and date
// router.get("/:doctorId/:date", getAvailabilityByDate);
router.get('/list', getAvailabilityList);
router.get('/:id', getAvailabilityById);
router.get('/getDoctor/:doctorId', getDoctorsByid);
router.put("/update/:id", updateAvailability);
router.get('/get-availability/:doctorId', getAvailability);
router.post('/doctors/:doctorId/availability', createAvailability);
router.delete('/availability/:id', deleteAvailability);


export default router;
