"use client";

import { useState, useRef, useEffect } from "react";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const notifications = [
    { id: 1, title: "Yangi ariza", description: "Siz ariza yuborildi", time: "5 min" },
    { id: 2, title: "Navbat o'zgarishi", description: "Sizning navbat o'rni o'zgardi", time: "1 soat" },
    { id: 3, title: "To'lov eslatmasi", description: "Oylik to'lov sanasi keldi", time: "1 kun" }
  ];

  return (
    <div className="notification-dropdown" ref={ref}>
      <button
        className="notification-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Bildirishnomalar"
      >
        <span className="notification-icon">🔔</span>
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Bildirishnomalar</h3>
          </div>
          <div className="notification-list">
            {notifications.map((notif) => (
              <div key={notif.id} className="notification-item">
                <div className="notification-content">
                  <p className="notification-title">{notif.title}</p>
                  <p className="notification-desc">{notif.description}</p>
                </div>
                <p className="notification-time">{notif.time}</p>
              </div>
            ))}
          </div>
          <div className="notification-footer">
            <a href="/dashboard/student" className="notification-link">
              Barcha bildirishnomalar
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
