import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

export const getResumeBucket = () => {
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error("MongoDB connection not initialized");
    }
    return new GridFSBucket(db, { bucketName: "resumes" });
};
