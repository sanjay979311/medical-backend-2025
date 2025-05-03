// import express from 'express';
// import {
//     totalCategory,
//     totalOrder,
//     totalProducts,
//     totalSubCategory,
//     totalCustomer, // ✅ Added missing import
//     totalEmployee  // ✅ If needed, add totalEmployee as well
// } from '../controllers/dashboardController.js';

// const router = express.Router();

// // Define GET routes
// router.get("/total-product", totalProducts);
// router.get("/total-category", totalCategory);
// router.get("/total-sub-category", totalSubCategory);
// router.get("/total-order", totalOrder);
// router.get("/total-customer", totalCustomer); // ✅ Fixed incorrect function call
// router.get("/total-employee", totalEmployee); // ✅ Optional: If tracking employees

// export default router;


import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

// Single API to fetch all dashboard stats at once
router.get("/stats", getDashboardStats);

export default router;