import { Job } from "../models/job.model.js";

const normalizeSkill = (skill) => (skill || "").toString().trim().toLowerCase();

const buildMatchedSkills = (jobSkills, candidateSkills) => {
    const candidateSet = new Set(candidateSkills.map(normalizeSkill));
    const matched = [];

    jobSkills.forEach((skill) => {
        const normalized = normalizeSkill(skill);
        if (normalized && candidateSet.has(normalized)) {
            matched.push(skill);
        }
    });

    return Array.from(new Set(matched));
};

const calculateMatchScore = ({ job, candidateSkills, experienceYears, preferredLocations }) => {
    const jobSkills = Array.isArray(job.skill_tags) && job.skill_tags.length > 0
        ? job.skill_tags
        : (Array.isArray(job.requirements) ? job.requirements : []);
    const matchedSkills = buildMatchedSkills(jobSkills, candidateSkills);

    const skillScore = jobSkills.length > 0 ? matchedSkills.length / jobSkills.length : 0;
    const jobExperience = Number(job.experienceLevel) || 0;
    const candidateExperience = Number(experienceYears) || 0;
    const experienceScore = jobExperience > 0
        ? Math.min(candidateExperience / jobExperience, 1)
        : 1;

    const normalizedPreferred = (preferredLocations || [])
        .map((location) => (location || "").toString().trim().toLowerCase())
        .filter(Boolean);
    const jobLocation = (job.location || "").toString().trim().toLowerCase();
    const locationScore = normalizedPreferred.length > 0
        ? (normalizedPreferred.some((loc) => jobLocation.includes(loc)) ? 1 : 0)
        : 0;

    const totalScore = (skillScore * 0.5) + (experienceScore * 0.3) + (locationScore * 0.2);
    const matchScore = Math.round(totalScore * 10000) / 100;

    return { matchScore, matchedSkills };
};

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId, skillTags, skill_tags } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            })
        };
        
        // Handle requirements - can be array or comma-separated string
        let requirementsArray = requirements;
        if (typeof requirements === 'string') {
            requirementsArray = requirements.split(",").map(r => r.trim()).filter(Boolean);
        }
        
        let skillTagsArray = skillTags || skill_tags || [];
        if (typeof skillTagsArray === "string") {
            skillTagsArray = skillTagsArray.split(",").map((tag) => tag.trim()).filter(Boolean);
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirementsArray,
            skill_tags: Array.isArray(skillTagsArray) ? skillTagsArray : [],
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experience),
            position: Number(position),
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: error.message || "Failed to create job", 
            success: false 
        });
    }
}

export const matchJobs = async (req, res) => {
    try {
        const { candidate_skills, experience_years, preferred_location, preferred_locations } = req.body;

        if (!Array.isArray(candidate_skills) || candidate_skills.length === 0) {
            return res.status(400).json({
                message: "candidate_skills must be a non-empty array.",
                success: false
            });
        }

        const preferredLocations = Array.isArray(preferred_locations)
            ? preferred_locations
            : (preferred_location ? [preferred_location] : []);

        const jobs = await Job.find({})
            .select("title skill_tags requirements experienceLevel location")
            .sort({ createdAt: -1 });

        const matches = jobs.map((job) => {
            const { matchScore, matchedSkills } = calculateMatchScore({
                job,
                candidateSkills: candidate_skills,
                experienceYears: experience_years,
                preferredLocations
            });

            return {
                job_id: job._id,
                title: job.title,
                match_score: matchScore,
                matched_skills: matchedSkills
            };
        }).sort((a, b) => b.match_score - a.match_score)
            .slice(0, 10);

        try {
            const { getIO } = await import("../utils/socket.js");
            const io = getIO();
            io.emit("job_match", {
                matches,
                criteria: {
                    candidate_skills,
                    experience_years,
                    preferred_locations: preferredLocations
                }
            });
        } catch (socketError) {
            console.log("Socket emit skipped:", socketError?.message || socketError);
        }

        return res.status(200).json({
            matches,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Failed to match jobs",
            success: false
        });
    }
};
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { location: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        return res.status(200).json({
            jobs: jobs || [],
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Failed to fetch jobs",
            success: false
        });
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Failed to fetch job",
            success: false
        });
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        return res.status(200).json({
            jobs: jobs || [],
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Failed to fetch admin jobs",
            success: false
        });
    }
}
