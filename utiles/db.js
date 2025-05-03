import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/practo', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB successfully");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
