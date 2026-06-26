"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, X, AlertTriangle, ChevronDown, User } from "lucide-react";
import { ROLE_OPTIONS, getRoleLabel, getSavedRole, saveRole } from "../lib/roleStore";
import { UserRole } from "../lib/mockData";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/report", label: "Report Emergency" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/ngo", label: "NGO Portal" },
  { href: "/admin", label: "Admin Map" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("citizen");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    setRole(getSavedRole());
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRoleChange = (nextRole: UserRole) => {
    setRole(nextRole);
    saveRole(nextRole);
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Shield size={20} />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoMain}>DisasterTrust</span>
            <span className={styles.logoSub}>AI</span>
          </div>
          <div className={styles.liveIndicator}>
            <span className="live-dot" />
            <span className={styles.liveLabel}>LIVE</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className={styles.links}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${pathname === link.href ? styles.active : ""} ${link.href === "/report" ? styles.reportLink : ""}`}
            >
              {link.href === "/report" && <AlertTriangle size={14} />}
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.roleSwitcher}>
          <div className={styles.roleLabel}>
            <User size={14} />
            <span>{getRoleLabel(role)}</span>
          </div>
          <div className={styles.roleOptions}>
            {ROLE_OPTIONS.map((option) => (
              <button
                key={option.id}
                className={`${styles.roleOption} ${role === option.id ? styles.roleOptionActive : ""}`}
                onClick={() => handleRoleChange(option.id)}
              >
                {option.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileRoleSwitcher}>
            <div className={styles.mobileRoleLabel}>
              <User size={14} />
              <span>Active role: {getRoleLabel(role)}</span>
            </div>
            <div className={styles.mobileRoleOptions}>
              {ROLE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  className={`${styles.mobileRoleOption} ${role === option.id ? styles.mobileRoleOptionActive : ""}`}
                  onClick={() => handleRoleChange(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileLink} ${pathname === link.href ? styles.active : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
