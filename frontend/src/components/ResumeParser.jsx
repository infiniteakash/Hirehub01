import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "./ui/dialog";
import { RESUME_DOWNLOAD_END_POINT, RESUME_PARSE_END_POINT, RESUME_SAVE_END_POINT } from "@/utils/constant";

const ResumeParser = () => {
    const [isParsing, setIsParsing] = useState(false);
    const [parsedData, setParsedData] = useState(null);
    const [fileMeta, setFileMeta] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (!acceptedFiles.length) return;
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append("file", file);

        setIsParsing(true);
        try {
            const res = await axios.post(RESUME_PARSE_END_POINT, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (res.data.success) {
                setParsedData(res.data.parsed_data);
                setFileMeta(res.data.file);
                setIsPreviewOpen(true);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to parse resume");
        } finally {
            setIsParsing(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
        },
        multiple: false
    });

    const handleSave = async () => {
        if (!fileMeta || !parsedData) return;
        try {
            const res = await axios.post(RESUME_SAVE_END_POINT, {
                file_id: fileMeta.id,
                file_meta: fileMeta,
                parsed_data: parsedData
            }, { withCredentials: true });

            if (res.data.success) {
                toast.success("Resume saved successfully.");
                setIsPreviewOpen(false);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to save resume");
        }
    };

    const handleDownload = async () => {
        if (!fileMeta?.id) return;
        try {
            const res = await axios.get(`${RESUME_DOWNLOAD_END_POINT}/${fileMeta.id}`, {
                withCredentials: true,
                responseType: "blob"
            });
            const blobUrl = window.URL.createObjectURL(res.data);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = fileMeta.filename || "resume";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to download resume");
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-10">
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 shadow-sm">
                <div
                    {...getRootProps()}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center transition ${
                        isDragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-200"
                    }`}
                >
                    <input {...getInputProps()} />
                    <h2 className="text-xl font-semibold text-gray-900">Upload your resume</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Drag and drop a PDF or DOCX file, or click to browse.
                    </p>
                    <Button className="mt-4" disabled={isParsing}>
                        {isParsing ? "Parsing..." : "Choose file"}
                    </Button>
                </div>
            </div>

            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Resume preview</DialogTitle>
                        <DialogDescription>Review the extracted details before saving.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-sm text-gray-700">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-xs text-gray-500">Name</p>
                                <p className="font-semibold text-gray-900">{parsedData?.name || "-"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="font-semibold text-gray-900">{parsedData?.email || "-"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="font-semibold text-gray-900">{parsedData?.phone || "-"}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Skills</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {parsedData?.skills?.length ? (
                                    parsedData.skills.map((skill) => (
                                        <Badge key={skill} variant="secondary">
                                            {skill}
                                        </Badge>
                                    ))
                                ) : (
                                    <span>No skills detected.</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Experience</p>
                            <p className="mt-1 whitespace-pre-wrap rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
                                {parsedData?.experience || "-"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Education</p>
                            <p className="mt-1 whitespace-pre-wrap rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
                                {parsedData?.education || "-"}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <Button className="flex-1" onClick={handleSave}>Save resume</Button>
                        <Button variant="outline" className="flex-1" onClick={handleDownload}>
                            Download
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => setIsPreviewOpen(false)}>
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ResumeParser;
