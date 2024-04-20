import { io } from "socket.io-client";
import { BackendLink } from "./link";

// Not connected until something actually needs it (e.g. the order-tracking
// page) - most pages never touch a socket at all.
export const socket = io(BackendLink, { autoConnect: false });
