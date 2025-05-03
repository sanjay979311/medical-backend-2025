import mongoose from 'mongoose';

const connection = { isConnected: false }; // No TypeScript interface

async function dbConnect() {
  if (connection.isConnected) {
    console.log('✅ Already connected to the database');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/practo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    connection.isConnected = db.connections[0].readyState === 1;
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

export default dbConnect;
