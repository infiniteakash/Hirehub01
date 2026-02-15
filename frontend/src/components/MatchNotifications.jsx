import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

const SOCKET_URL = "http://localhost:8002";

const MatchNotifications = () => {
    useEffect(() => {
        const socket = io(SOCKET_URL, { withCredentials: true });

        socket.on("job_match", (payload) => {
            const count = payload?.matches?.length || 0;
            if (count > 0) {
                toast.success(`New job matches found: ${count}`);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return null;
};

export default MatchNotifications;
