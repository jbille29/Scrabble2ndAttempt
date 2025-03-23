import React, { useEffect, useState } from "react";

const ToastNotification = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // Trigger animation on mount

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out animation before removing
    }, 2500); // Show for 2.5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: visible ? "10%" : "5%", // Starts higher and moves down
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#333",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        fontSize: "16px",
        zIndex: 1000,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease-in-out, top 0.3s ease-in-out",
      }}
    >
      {message}
    </div>
  );
};

export default ToastNotification;
