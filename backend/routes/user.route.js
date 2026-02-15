import express from "express";
import { downloadResume, listResumes, login, logout, parseResume, register, saveParsedResume, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);
router.route("/resume/parse").post(isAuthenticated, singleUpload, parseResume);
router.route("/resume/save").post(isAuthenticated, saveParsedResume);
router.route("/resume/list").get(isAuthenticated, listResumes);
router.route("/resume/download/:id").get(isAuthenticated, downloadResume);

export default router;

