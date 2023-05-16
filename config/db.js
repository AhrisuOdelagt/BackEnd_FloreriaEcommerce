import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(
            process.env.MONGO_URI, {
                useNewURLParser: true,
                useUnifiedTopology: true
            }
            );
        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log(`MongoDB se encuentra conectado en ${url}`);
    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
