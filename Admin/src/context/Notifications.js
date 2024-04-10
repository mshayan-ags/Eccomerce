import React, { createContext, useEffect, useState } from "react";
import { socket } from "../socket";
import { withAuthContext } from "./Auth";

export const NotificationsContext = createContext();

export const withNotificationsContext = (Component) => (props) =>
  (
    <NotificationsContext.Consumer>
      {(value) => <Component {...value} {...props} />}
    </NotificationsContext.Consumer>
  );

const MAX_NOTIFICATIONS = 20;

const NotificationsProvider = ({ children, Token }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const authToken = Token || localStorage.getItem("token");
    if (!authToken) return;

    socket.connect();
    socket.emit("join-admin", { token: authToken });

    const handleNewOrder = (order) => {
      setNotifications((prev) => [
        { id: order?.id, customer: order?.customer, total: order?.total, receivedAt: Date.now() },
        ...prev,
      ].slice(0, MAX_NOTIFICATIONS));
      setUnreadCount((count) => count + 1);
    };

    socket.on("new-order", handleNewOrder);

    return () => {
      socket.off("new-order", handleNewOrder);
      socket.disconnect();
    };
  }, [Token]);

  function markAllRead() {
    setUnreadCount(0);
  }

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAllRead }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default withAuthContext(NotificationsProvider);
