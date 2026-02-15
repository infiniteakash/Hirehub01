import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    parsedData: {
        name: { type: String },
        email: { type: String },
        phone: { type: String },
        skills: [{ type: String }],
        experience: { type: String },
        education: { type: String }
    },
    skill_tags: [{ type: String }]
}, { timestamps: true });

export const Resume = mongoose.model("Resume", resumeSchema);
