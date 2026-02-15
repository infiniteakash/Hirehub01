import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog";

const MatchCard = ({ job }) => {
    const matchScore = Number(job?.match_score) || 0;
    const matchedSkills = Array.isArray(job?.matched_skills) ? job.matched_skills : [];

    const scoreLabel = useMemo(() => {
        if (matchScore >= 80) return "Excellent match";
        if (matchScore >= 60) return "Strong match";
        if (matchScore >= 40) return "Fair match";
        return "Emerging match";
    }, [matchScore]);

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job?.title}</h3>
                    <p className="text-sm text-gray-500">Match confidence</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700" variant="secondary">
                    {scoreLabel}
                </Badge>
            </div>

            <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Match score</span>
                    <span className="font-semibold text-gray-900">{matchScore}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(matchScore, 100)}%` }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {matchedSkills.length > 0 ? (
                    matchedSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                        </Badge>
                    ))
                ) : (
                    <span className="text-xs text-gray-500">No overlapping skills yet.</span>
                )}
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mt-4 w-full" variant="outline">
                        Why you match
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Why you match {job?.title}</DialogTitle>
                        <DialogDescription>
                            Skills and preferences aligned with this role.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 text-sm text-gray-600">
                        <div>
                            <p className="font-semibold text-gray-900">Matched skills</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {matchedSkills.length > 0 ? (
                                    matchedSkills.map((skill) => (
                                        <Badge key={skill} variant="secondary">
                                            {skill}
                                        </Badge>
                                    ))
                                ) : (
                                    <span>No direct skill overlap yet.</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Match breakdown</p>
                            <ul className="mt-2 space-y-1">
                                <li>Skills alignment contributes 50%.</li>
                                <li>Experience fit contributes 30%.</li>
                                <li>Location preference contributes 20%.</li>
                            </ul>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MatchCard;
