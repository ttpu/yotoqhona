"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface ProfileDropdownProps {
  displayName: string;
  profileHref: string;
}

export default function ProfileDropdown({ displayName, profileHref }: ProfileDropdownProps) {
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

  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="profile-dropdown" ref={ref}>
      <button
        className="profile-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Profil menyu"
      >
        <div className="profile-avatar">{firstLetter}</div>
        <span className="profile-name">{displayName}</span>
        <span className={`profile-chevron ${isOpen ? "open" : ""}`}>▼</span>
      </button>

      {isOpen && (
        <div className="profile-menu">
          <Link href={profileHref} className="profile-menu-item">
            Profil
          </Link>
          <Link href="/dashboard/student" className="profile-menu-item">
            Menинг аризаларим
          </Link>
          <Link href="/dashboard/student" className="profile-menu-item">
            Менинг яшаш джойим
          </Link>
          <Link href="/dashboard/student" className="profile-menu-item">
            То&#39;ловлар
          </Link>
          <Link href="/dashboard/student" className="profile-menu-item">
            Билдиришномалар
          </Link>
          <Link href="/dashboard/student" className="profile-menu-item">
            Созламалар
          </Link>
          <Link href="#" className="profile-menu-item">
            Йордам маркази
          </Link>
          <div className="profile-menu-separator"></div>
          <Link href="/api/auth/logout" className="profile-menu-item logout">
            Чикиш
          </Link>
        </div>
      )}
    </div>
  );
}
