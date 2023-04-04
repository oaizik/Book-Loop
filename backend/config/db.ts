import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const db: string = process.env.mongoURI;

const connectDB = async (): Promise<void> => {
	try {
		await mongoose.connect(db);
		console.log("MongoDb Connected...");
	} catch (e: any) {
		console.log("MongoDB connection Error: ", e.message);
		// exit process with failure
		process.exit(1);
	}
};

export default connectDB;