import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // First, try IPv4 connection
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4,
            autoIndex: true,
            directConnection: false,
        }).catch(async (err) => {
            // If IPv4 fails, try without family restriction
            console.log('Retrying connection without IPv4 restriction...');
            return await mongoose.connect(process.env.MONGO_URI, {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                autoIndex: true,
                directConnection: false,
            });
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Error handling
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
        });

    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        console.error("\nPossible solutions:");
        console.error("1. Check your internet connection");
        console.error("2. Verify MongoDB Atlas credentials");
        console.error("3. Whitelist your IP in MongoDB Atlas (Network Access)");
        console.error("4. Check if MongoDB Atlas cluster is active");
        console.error("5. Try using DNS: 8.8.8.8 or 1.1.1.1");
        
        // Don't exit immediately in development
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        } else {
            console.log("\nContinuing without MongoDB connection...");
        }
    }
};