import pdfParse from "pdf-parse";
import mammoth from "mammoth";

const normalizeText = (text) => (text || "").replace(/\r/g, "").replace(/\t/g, " ").replace(/[ ]{2,}/g, " ").trim();

const extractName = (lines) => {
    for (const line of lines) {
        const candidate = line.trim();
        if (!candidate) continue;
        if (candidate.length > 60) continue;
        if (/\d/.test(candidate)) continue;
        if (candidate.includes("@")) continue;
        if (/resume|curriculum vitae/i.test(candidate)) continue;
        return candidate;
    }
    return "";
};

const extractSection = (text, headings) => {
    const pattern = new RegExp(`(?:^|\n)\s*(${headings.join("|")})\s*:?\s*\n`, "i");
    const match = text.match(pattern);
    if (!match) return "";
    const startIndex = match.index + match[0].length;
    const rest = text.slice(startIndex);
    const nextHeading = rest.match(/\n\s*[A-Z][A-Z\s]{2,}\s*:?\n/);
    const section = nextHeading ? rest.slice(0, nextHeading.index) : rest;
    return normalizeText(section);
};

const SKILL_KEYWORDS = [
    "javascript",
    "typescript",
    "react",
    "redux",
    "node",
    "express",
    "mongodb",
    "mongoose",
    "sql",
    "postgresql",
    "mysql",
    "html",
    "css",
    "tailwind",
    "aws",
    "docker",
    "kubernetes",
    "python",
    "java",
    "c#",
    "c++",
    "git",
    "rest",
    "graphql"
];

const extractSkills = (text) => {
    const lower = text.toLowerCase();
    const matched = SKILL_KEYWORDS.filter((skill) => lower.includes(skill));
    return Array.from(new Set(matched)).map((skill) => skill[0].toUpperCase() + skill.slice(1));
};

const extractEmail = (text) => {
    const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    return match ? match[0] : "";
};

const extractPhone = (text) => {
    const match = text.match(/(\+?\d[\d\s().-]{7,}\d)/);
    return match ? match[0].trim() : "";
};

export const parseResumeBuffer = async (file) => {
    let rawText = "";

    if (file.mimetype === "application/pdf") {
        const result = await pdfParse(file.buffer);
        rawText = result.text || "";
    } else {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        rawText = result.value || "";
    }

    const normalized = normalizeText(rawText);
    const lines = normalized.split("\n").map((line) => line.trim()).filter(Boolean);

    const experience = extractSection(rawText, ["experience", "work experience", "employment", "work history"]);
    const education = extractSection(rawText, ["education", "academics", "qualification", "qualifications"]);
    const skills = extractSkills(rawText);

    return {
        name: extractName(lines),
        email: extractEmail(rawText),
        phone: extractPhone(rawText),
        skills,
        experience,
        education
    };
};
