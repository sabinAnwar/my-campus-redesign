import type { ReactElement } from "react";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  User as UserIcon,
  Settings as SettingsIcon,
  BookOpenCheck,
  FileText,
  BadgeCheck,
  LogOut,
} from "lucide-react";

import { useClickOutside } from "~/hooks/useClickOutside";
import { MenuItem } from "~/components/ui/MenuItem";

interface ProfileMenuProps {
  /** Whether the menu is open */
  isOpen: boolean;
  /** Callback to toggle menu open/close */
  onToggle: () => void;
  /** Callback to close the menu */
  onClose: () => void;
  /** User's display name */
  userName: string;
  /** Translations for menu items */
  translations: {
    student: string;
    online: string;
    settings: string;
    curriculum: string;
    moduleHandbook: string;
    studentId: string;
    certificates: string;
    transcript: string;
    immatriculation: string;
    logout: string;
  };
}

/**
 * User profile dropdown menu component.
 * Shows user avatar, name, and quick access links.
 *
 * @example
 * <ProfileMenu
 *   isOpen={menuOpen}
 *   onToggle={() => setMenuOpen(v => !v)}
 *   onClose={() => setMenuOpen(false)}
 *   userName={userName}
 *   translations={shellText.menu}
 * />
 */
export function ProfileMenu({
  isOpen,
  onToggle,
  onClose,
  userName,
  translations,
}: ProfileMenuProps): ReactElement {
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu when clicking outside
  useClickOutside(menuRef as React.RefObject<HTMLElement>, onClose, isOpen);

  /**
   * Generates user initials from full name.
   * Falls back to first two letters of student label if no name provided.
   */
  const getUserInitials = (): string => {
    if (userName) {
      return userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return translations.student.substring(0, 2).toUpperCase();
  };

  /**
   * Gets display name, falling back to translation if generic name.
   */
  const getDisplayName = (): string => {
    if (userName && userName !== "Student" && userName !== "Studierender") {
      return userName;
    }
    return translations.student;
  };

  return (
    <>
      {/* Profile Button */}
      <button
        onClick={onToggle}
        className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-iu-blue text-white shadow-xl shadow-iu-blue/30 hover:shadow-iu-blue/50 transition-all active:scale-95 flex items-center justify-center font-bold focus:outline-none focus:ring-4 focus:ring-iu-blue/20"
        aria-label="Open profile menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-4 md:right-6 top-20 z-50 w-72 bg-card text-card-foreground border border-border rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* User Info Header */}
          <div className="px-5 py-5 border-b border-border bg-iu-blue/5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-iu-blue flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {getUserInitials()}
              </div>
              <div>
                <div className="font-black text-foreground uppercase tracking-tight">
                  {getDisplayName()}
                </div>
                <div className="text-[10px] font-black text-iu-blue dark:text-white uppercase tracking-[0.2em]">
                  {translations.online}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Links */}
          <ul onClick={onClose} className="py-1" role="menu">
            <li role="none">
              <MenuItem
                to="/settings"
                icon={SettingsIcon}
                label={translations.settings}
              />
            </li>
            <li role="none">
              <MenuItem
                to="/curriculum"
                icon={BookOpenCheck}
                label={translations.curriculum}
              />
            </li>
            <li role="none">
              <MenuItem
                to="/module-handbook"
                icon={FileText}
                label={translations.moduleHandbook}
              />
            </li>
            <li role="none">
              <MenuItem
                to="/student-id"
                icon={BadgeCheck}
                label={translations.studentId}
              />
            </li>

            {/* Certificates Section Header */}
            <li role="presentation" className="px-5 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/30">
              {translations.certificates}
            </li>

            <li role="none">
              <MenuItem
                to="/certificates/transcript"
                icon={FileText}
                label={translations.transcript}
              />
            </li>
            <li role="none">
              <MenuItem
                to="/certificates/immatriculation"
                icon={FileText}
                label={translations.immatriculation}
              />
            </li>

            <li role="separator" className="border-t border-border my-1" />

            <li role="none">
              <MenuItem
                to="/logout"
                icon={LogOut}
                label={translations.logout}
                danger
              />
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
