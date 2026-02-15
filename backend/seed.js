import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./models/user.model.js";
import { Company } from "./models/company.model.js";
import { Job } from "./models/job.model.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongodb connected successfully');
    } catch (error) {
        console.log(error);
    }
}

const seed = async () => {
    await connectDB();

    try {
        console.log("Checking for existing data...");
        // 1. Find or Create Recruiter
        let recruiter = await User.findOne({ email: "testrecruiter@example.com" });
        if (!recruiter) {
            const hashedPassword = await bcrypt.hash("password123", 10);
            recruiter = await User.create({
                fullname: "Test Recruiter",
                email: "testrecruiter@example.com",
                phoneNumber: "1234567890",
                password: hashedPassword,
                role: "recruiter"
            });
            console.log("Recruiter created: testrecruiter@example.com / password123");
        } else {
            console.log("Recruiter already exists.");
        }

        // 2. Find or Create Companies
        const demoCompanies = [
            {
                name: "FinPay",
                description: "Digital payments infrastructure powering seamless transactions for modern businesses.",
                industry: "FinTech",
                companySize: "51-200",
                headquarters: "San Francisco, CA",
                foundedYear: 2018,
                website: "https://finpay.io",
                socialLinks: { linkedin: "https://linkedin.com/company/finpay", twitter: "https://twitter.com/finpay" },
                techStack: ["Node.js", "MongoDB", "Kafka", "Kubernetes"],
                benefits: ["Equity", "Remote stipend", "Health insurance"],
                culture: "Mission-driven, high ownership, and customer-obsessed.",
                rating: 4.6,
                totalReviews: 128,
                location: "San Francisco, CA"
            },
            {
                name: "CloudDesk",
                description: "Remote-first B2B CRM platform helping teams close deals faster.",
                industry: "SaaS",
                companySize: "201-500",
                headquarters: "Austin, TX",
                foundedYear: 2016,
                website: "https://clouddesk.com",
                socialLinks: { linkedin: "https://linkedin.com/company/clouddesk", twitter: "https://twitter.com/clouddesk" },
                techStack: ["React", "Node.js", "PostgreSQL", "Redis"],
                benefits: ["Flexible PTO", "Home office budget", "Learning stipend"],
                culture: "Remote-first, collaborative, and product-led.",
                rating: 4.4,
                totalReviews: 212,
                location: "Remote"
            },
            {
                name: "NeuroLens",
                description: "ML-powered analytics platform delivering real-time insights at scale.",
                industry: "AI / ML",
                companySize: "11-50",
                headquarters: "New York, NY",
                foundedYear: 2020,
                website: "https://neurolens.ai",
                socialLinks: { linkedin: "https://linkedin.com/company/neurolens", twitter: "https://twitter.com/neurolens" },
                techStack: ["Python", "PyTorch", "FastAPI", "AWS"],
                benefits: ["Equity", "Health insurance", "Conference budget"],
                culture: "Research-driven, curious, and impact-focused.",
                rating: 4.7,
                totalReviews: 64,
                location: "New York, NY"
            },
            {
                name: "TechCorp Global",
                description: "Enterprise technology leader delivering secure infrastructure worldwide.",
                industry: "Enterprise",
                companySize: "1000+",
                headquarters: "Seattle, WA",
                foundedYear: 2001,
                website: "https://techcorp.com",
                socialLinks: { linkedin: "https://linkedin.com/company/techcorp", twitter: "https://twitter.com/techcorp" },
                techStack: ["Java", ".NET", "Kubernetes", "Azure"],
                benefits: ["401k match", "Health insurance", "Wellness stipend"],
                culture: "Customer-first, reliable, and quality-focused.",
                rating: 4.2,
                totalReviews: 892,
                location: "Seattle, WA"
            }
        ];

        const companyMap = {};
        for (const companyData of demoCompanies) {
            let company = await Company.findOne({ name: companyData.name });
            if (!company) {
                company = await Company.create({
                    ...companyData,
                    userId: recruiter._id
                });
                console.log(`Company '${companyData.name}' created.`);
            } else {
                console.log(`Company '${companyData.name}' already exists.`);
            }
            companyMap[companyData.name] = company;
        }

        // 3. Create Jobs
        const demoJobs = [
            { companyName: "FinPay", title: "Backend Engineer", location: "San Francisco, CA", jobType: "Full Time", salary: 28, experienceLevel: 3 },
            { companyName: "FinPay", title: "DevOps Engineer", location: "Remote", jobType: "Full Time", salary: 32, experienceLevel: 4 },
            { companyName: "CloudDesk", title: "Frontend Developer", location: "Remote", jobType: "Full Time", salary: 24, experienceLevel: 2 },
            { companyName: "CloudDesk", title: "Product Designer", location: "Remote", jobType: "Full Time", salary: 22, experienceLevel: 3 },
            { companyName: "NeuroLens", title: "ML Engineer", location: "New York, NY", jobType: "Full Time", salary: 35, experienceLevel: 4 },
            { companyName: "NeuroLens", title: "Data Scientist", location: "New York, NY", jobType: "Full Time", salary: 33, experienceLevel: 3 },
            { companyName: "TechCorp Global", title: "Senior Software Engineer", location: "Seattle, WA", jobType: "Full Time", salary: 30, experienceLevel: 5 },
            { companyName: "TechCorp Global", title: "Security Engineer", location: "Seattle, WA", jobType: "Full Time", salary: 29, experienceLevel: 4 }
        ];

        console.log("Seeding jobs...");
        for (const jobData of demoJobs) {
            const company = companyMap[jobData.companyName];
            if (!company) continue;
            const existingJob = await Job.findOne({ title: jobData.title, company: company._id });
            if (!existingJob) {
                await Job.create({
                    title: jobData.title,
                    description: `We are looking for a talented ${jobData.title} to join our team. You will build scalable, high-impact systems with modern tooling.`,
                    requirements: ["JavaScript", "React", "Node.js", "MongoDB"],
                    salary: jobData.salary,
                    experienceLevel: jobData.experienceLevel,
                    location: jobData.location,
                    jobType: jobData.jobType,
                    position: Math.floor(Math.random() * 5) + 1,
                    company: company._id,
                    created_by: recruiter._id
                });
            }
        }
        console.log("Jobs seeded successfully.");

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seed();
