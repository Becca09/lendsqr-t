// Sidebar.tsx (Next.js + SCSS Module)
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import styles from "../styles/sidebar.module.scss";

export default function Sidebar({ variant = "default", open = false, onClose }: { variant?: "default" | "drawer"; open?: boolean; onClose?: () => void }) {
  const pathname = usePathname?.() || "";
  const router = useRouter();

  type Item = {
    href: string;
    label: string;
    iconSrc: string;
    activeRule?: (p: string) => boolean;
  };

  const customers: Item[] = [
    { href: "/users", label: "Users", iconSrc: "/images/sidebar/users.svg", activeRule: (p) => p.startsWith("/users") },
    { href: "/guarantors", label: "Guarantors", iconSrc: "/images/sidebar/guarantors.svg" },
    { href: "/loans", label: "Loans", iconSrc: "/images/sidebar/loans.svg" },
    { href: "/decision-models", label: "Decision Models", iconSrc: "/images/sidebar/decisions.svg" },
    { href: "/savings", label: "Savings", iconSrc: "/images/sidebar/savings.svg" },
    { href: "/loan-requests", label: "Loan Requests", iconSrc: "/images/sidebar/loan-request.svg" },
    { href: "/whitelist", label: "Whitelist", iconSrc: "/images/sidebar/whitelist.svg" },
    { href: "/karma", label: "Karma", iconSrc: "/images/sidebar/karma.svg" },
  ];

  const businesses: Item[] = [
    { href: "/organization", label: "Organization", iconSrc: "/images/sidebar/organization.svg" },
    { href: "/loan-products", label: "Loan Products", iconSrc: "/images/sidebar/loan-product.svg" },
    { href: "/savings-products", label: "Savings Products", iconSrc: "/images/sidebar/savings-product.svg" },
    { href: "/fees-charges", label: "Fees and Charges", iconSrc: "/images/sidebar/fees-charges.svg" },
    { href: "/transactions", label: "Transactions", iconSrc: "/images/sidebar/transactions.svg" },
    { href: "/services", label: "Services", iconSrc: "/images/sidebar/services.svg" },
    { href: "/service-account", label: "Service Account", iconSrc: "/images/sidebar/service-account.svg" },
    { href: "/settlements", label: "Settlements", iconSrc: "/images/sidebar/settlements.svg" },
    { href: "/reports", label: "Reports", iconSrc: "/images/sidebar/reports.svg" },
  ];

  const settings: Item[] = [
    { href: "/preferences", label: "Preferences", iconSrc: "/images/sidebar/preferences.svg" },
    { href: "/fees-pricing", label: "Fees and Pricing", iconSrc: "/images/sidebar/fees-pricing.svg" },
    { href: "/audit-logs", label: "Audit Logs", iconSrc: "/images/sidebar/audit-logs.svg" },
  ];

  const asideClass = `${styles.sidebar} ${variant === "drawer" ? styles.drawer : ""} ${open ? styles.open : ""}`.trim();
  return (
    <>
    {variant === "drawer" && open && <div className={styles.backdrop} onClick={onClose} />}
    <aside className={asideClass}>
      <div className={styles.orgSwitcher}>
        <img src="/images/sidebar/organization.svg" alt="" />
        <span>Switch Organization</span>
        <ChevronDown className={styles.chev} />
      </div>

      <nav className={styles.nav}>
        <NavItem href="/dashboard" icon={<img src="/images/sidebar/dashbaord.svg" alt="" />} label="Dashboard" active={pathname === "/dashboard"} />
      </nav>

      <SectionLabel>CUSTOMERS</SectionLabel>
      <nav className={styles.nav}>
        {customers.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={<img src={item.iconSrc} alt="" />}
            label={item.label}
            active={item.activeRule ? item.activeRule(pathname) : pathname === item.href}
          />
        ))}
      </nav>

      <SectionLabel>BUSINESSES</SectionLabel>
      <nav className={styles.nav}>
        {businesses.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={<img src={item.iconSrc} alt="" />}
            label={item.label}
            active={pathname === item.href}
          />
        ))}
      </nav>

      <SectionLabel>SETTINGS</SectionLabel>
      <nav className={styles.nav}>
        {settings.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={<img src={item.iconSrc} alt="" />}
            label={item.label}
            active={pathname === item.href}
          />
        ))}
      </nav>

      <div className={styles.footer}>
        <button
          className={styles.logoutBtn}
          onClick={() => {
            try { localStorage.removeItem("auth"); } catch {}
            router.replace("/login");
          }}
        >
          <LogOut className={styles.icon} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className={styles.sectionLabel}>{children}</div>;
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link href={href} className={`${styles.item} ${active ? styles.active : ""}`}> 
      <i className={styles.icon}>{icon}</i>
      <span className={styles.label}>{label}</span>
    </Link>
  );
}

