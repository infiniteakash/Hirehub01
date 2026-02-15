import { User } from "../models/user.model.js";
import { Resume } from "../models/resume.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { parseResumeBuffer } from "../utils/resumeParser.js";
import { getResumeBucket } from "../utils/gridfs.js";
import mongoose from "mongoose";

const uploadToGridFs = (bucket, file, userId) => new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
        metadata: {
            userId: userId?.toString() || ""
        }
    });

    uploadStream.on("error", reject);
    uploadStream.on("finish", () => resolve(uploadStream.id));
    uploadStream.end(file.buffer);
});

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        const fileUri = getDataUri(file);
        let cloudResponse = null;
        if (fileUri) {
            try {
                cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            } catch (error) {
                console.log("Cloudinary upload failed:", error);
                // Continue without uploading
            }
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto: cloudResponse?.secure_url || "",
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false
        });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        
        const file = req.file;
        // cloudinary ayega idhar
        const fileUri = getDataUri(file);
        const cloudResponse = fileUri ? await cloudinary.uploader.upload(fileUri.content) : null;



        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray
      
        // resume comes later here...
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const parseResume = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "Resume file is required.",
                success: false
            });
        }

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({
                message: "Only PDF or DOCX files are supported.",
                success: false
            });
        }

        const parsedData = await parseResumeBuffer(file);
        const bucket = getResumeBucket();
        const fileId = await uploadToGridFs(bucket, file, req.id);

        return res.status(200).json({
            success: true,
            parsed_data: parsedData,
            file: {
                id: fileId?.toString ? fileId.toString() : fileId,
                filename: file.originalname,
                contentType: file.mimetype
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Failed to parse resume",
            success: false
        });
    }
};

export const saveParsedResume = async (req, res) => {
    try {
        const { file_id, file_meta, parsed_data } = req.body;

        if (!file_id || !parsed_data) {
            return res.status(400).json({
                message: "file_id and parsed_data are required.",
                success: false
            });
        }

        const resume = await Resume.create({
            user: req.id,
            fileId: file_id,
            filename: file_meta?.filename || "resume",
            contentType: file_meta?.contentType || "application/octet-stream",
            parsedData: parsed_data,
            skill_tags: parsed_data?.skills || []
        });

        const user = await User.findById(req.id);
        if (user) {
            const newSkills = Array.isArray(parsed_data?.skills) ? parsed_data.skills : [];
            const existingProfileSkills = Array.isArray(user.profile?.skills) ? user.profile.skills : [];
            const existingTags = Array.isArray(user.skill_tags) ? user.skill_tags : [];
            const merged = Array.from(new Set([...existingProfileSkills, ...newSkills]));

            user.profile.skills = merged;
            user.skill_tags = Array.from(new Set([...existingTags, ...newSkills]));
            await user.save();
        }

        return res.status(201).json({
            success: true,
            resume
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Failed to save parsed resume",
            success: false
        });
    }
};

export const downloadResume = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "Resume id is required.",
                success: false
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid resume id.",
                success: false
            });
        }

        const resume = await Resume.findOne({ fileId: id, user: req.id });
        if (!resume) {
            return res.status(404).json({
                message: "Resume not found.",
                success: false
            });
        }

        const bucket = getResumeBucket();
        const fileObjectId = new mongoose.Types.ObjectId(resume.fileId);
        const files = await bucket.find({ _id: fileObjectId }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({
                message: "Resume file not found.",
                success: false
            });
        }

        const file = files[0];
        res.set({
            "Content-Type": file.contentType || "application/octet-stream",
            "Content-Disposition": `attachment; filename="${file.filename}"`
        });

        const downloadStream = bucket.openDownloadStream(fileObjectId);
        downloadStream.on("error", (error) => {
            console.log(error);
            return res.status(500).json({
                message: "Failed to download resume.",
                success: false
            });
        });

        downloadStream.pipe(res);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Failed to download resume",
            success: false
        });
    }
};

export const listResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.id })
            .select("fileId filename contentType parsedData createdAt")
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            resumes: resumes || []
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Failed to fetch resumes",
            success: false
        });
    }
};