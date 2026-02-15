import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import { matchJobs } from "./controllers/job.controller.js";
import { initSocket } from "./utils/socket.js";

dotenv.config({});

const app = express();
const server = http.createServer(app);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}

app.use(cors(corsOptions));
// Trigger restart for config update

const PORT = process.env.PORT || 5000;


// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.post("/api/match-jobs", matchJobs);

const io = initSocket(server, corsOptions);
io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});



server.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});