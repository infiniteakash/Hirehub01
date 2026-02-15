import { Server } from "socket.io";

let ioInstance = null;

export const initSocket = (server, corsOptions) => {
    ioInstance = new Server(server, {
        cors: corsOptions || { origin: "*", credentials: true }
    });

    return ioInstance;
};

export const getIO = () => {
    if (!ioInstance) {
        throw new Error("Socket.io not initialized");
    }
    return ioInstance;
};
