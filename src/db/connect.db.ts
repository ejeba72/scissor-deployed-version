import { config } from "dotenv";
import { connect } from "mongoose";

config();
// const DB_URI: string | undefined = process.env.DB_URI;

if (!process.env.DB_URI) {
    throw new Error('MongoDB URI not found in environment variables');
}

const DB_URI: string = process.env.DB_URI as string;

async function mongodb(): Promise<void> {
    try {
        await connect(DB_URI);
        console.log(`MongoDB is connected`);
    } catch (err: unknown) {
        if ( err instanceof Error) {
            console.log(err.message);
        } else {
            console.log(err);
        }
    }
}

export { mongodb };