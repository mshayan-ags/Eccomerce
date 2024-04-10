import { io } from "socket.io-client";

// Not connected until an authenticated admin actually needs it - see
// context/Notifications.js, which connects and joins the admin room once a
// token is available.
export const socket = io(process.env.REACT_APP_PUBLIC_PATH, { autoConnect: false });
