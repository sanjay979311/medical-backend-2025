
// import express from 'express';
// import dbConnect from './dbconnect.js';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import morgan from 'morgan';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import path from 'path';

// // Load environment variables
// dotenv.config();

// // Initialize app
// const app = express();

// // Connect to MongoDB
// dbConnect();

// // Middleware setup
// app.set('view engine', 'ejs');
// app.use(morgan('dev'));
// app.use(bodyParser.json({ limit: '2mb' }));
// app.use(cookieParser());

// // Dynamic CORS setup
// const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

// app.use(cors({
//     origin: function (origin, callback) {
//         // Allow requests with no origin (e.g. curl, mobile apps)
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.includes(origin)) {
//             return callback(null, true);
//         } else {
//             return callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true
// }));

// // Serve static files
// const __dirname = path.resolve();
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// app.use('/docs', express.static(path.join(__dirname, 'docs')));

// // Route imports
// import mailRoutes from './routes/sendMailRoute.js';
// import authRoutes from './routes/authRoute.js';
// import userRoutes from './routes/users.js';
// import categoryRoutes from './routes/categoryRoute.js';
// import countryRoutes from './routes/countryRoutes.js';
// import stateRoutes from './routes/stateRoutes.js';
// import cityRoutes from './routes/cityRoute.js';

// import logoRoute from './routes/logoRoute.js';

// import dashboardRoute from './routes/dashboardRoute.js';

// import timeSlotRoutes from './routes/timeSlotRoute.js';
// import doctorAvailabilityRoutes from './routes/doctorAvailabilityRoutes.js';
// import paymentRoutes from './routes/paymentRoutes.js';

// // Route setup
// app.use('/api/send-mail', mailRoutes);
// app.use('/api', categoryRoutes);

// app.use('/api', authRoutes);
// app.use('/api', userRoutes);

// app.use('/api/country', countryRoutes);
// app.use('/api/state', stateRoutes);
// app.use('/api/city', cityRoutes);

// app.use('/api/logo', logoRoute);
// app.use('/api/dashboard', dashboardRoute);
// app.use('/api/time-slots', timeSlotRoutes);
// app.use('/api/availability', doctorAvailabilityRoutes);
// app.use('/api/payment', paymentRoutes);

// // Start server
// const port = process.env.PORT || 8000;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });


import express from 'express';
import mongoose from 'mongoose'; // 👈 Direct mongoose import
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// 🟢 MongoDB Connection
const connectToDB = async () => {
  try {
    const db = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/practo',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
};

connectToDB(); // 👈 Invoke DB connection

// Middleware setup
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cookieParser());

// Dynamic CORS setup
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Serve static files
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/docs', express.static(path.join(__dirname, 'docs')));

// Route imports
import mailRoutes from './routes/sendMailRoute.js';
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/users.js';
import categoryRoutes from './routes/categoryRoute.js';
import countryRoutes from './routes/countryRoutes.js';
import stateRoutes from './routes/stateRoutes.js';
import cityRoutes from './routes/cityRoute.js';
import logoRoute from './routes/logoRoute.js';
import dashboardRoute from './routes/dashboardRoute.js';
import timeSlotRoutes from './routes/timeSlotRoute.js';
import doctorAvailabilityRoutes from './routes/doctorAvailabilityRoutes.js';
// import paymentRoutes from './routes/paymentRoutes.js';

// Route setup
app.use('/api/send-mail', mailRoutes);
app.use('/api', categoryRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api/country', countryRoutes);
app.use('/api/state', stateRoutes);
app.use('/api/city', cityRoutes);
app.use('/api/logo', logoRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/time-slots', timeSlotRoutes);
app.use('/api/availability', doctorAvailabilityRoutes);
// app.use('/api/payment', paymentRoutes);

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
