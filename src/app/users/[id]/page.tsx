"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getUserById, type User } from "../../../lib/users";
import UserTabHeader from "../../../components/UserTabHeader";
import styles from "../../../styles/user-details.module.scss";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.field}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
}

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState("general");

  useEffect(() => {
    try {
      if (localStorage.getItem("auth") !== "1") router.replace("/login");
    } catch {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    const u = id ? getUserById(id) : null;
    setUser(u);
  }, [id]);

  const tabs = useMemo(
    () => [
      { key: "general", label: "General Details" },
      { key: "documents", label: "Documents" },
      { key: "bank", label: "Bank Details" },
      { key: "loans", label: "Loans" },
      { key: "savings", label: "Savings" },
      { key: "app", label: "App and System" },
    ],
    []
  );

  if (!user) {
    return (
      <main className={styles.page}>
        <Link href="/users" className={styles.back}>
          &larr; Back to Users
        </Link>
        <p style={{ marginTop: 16 }}>Loading user...</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Link href="/users" className={styles.back}>
        &larr; Back to Users
      </Link>

      <div className={styles.titleRow}>
        <p className={styles.userDetails}>User Details</p>
        <div className={styles.actions}>
          <button className={`${styles.actionBtn} ${styles.black}`}>BLACKLIST USER</button>
          <button className={`${styles.actionBtn} ${styles.activate}`}>ACTIVATE USER</button>
        </div>
      </div>

      <UserTabHeader
        user={user}
        activeTab={tab}
        onChangeTab={(k) => setTab(k)}
      />

      {tab === "general" && (
        <div className={styles.sections}>
          <section className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>Personal Information</h3>
            <div className={styles.grid}>
              <Row label="Full Name" value={user.username} />
              <Row label="Phone Number" value={user.phoneNumber} />
              <Row label="Email Address" value={user.email} />
              <Row label="BVN" value={user.id.padStart(11, "0")} />
              <Row label="Gender" value={Number(user.id) % 2 ? "Male" : "Female"} />
              <Row label="Marital Status" value={Number(user.id) % 2 ? "Single" : "Married"} />
              <Row label="Children" value={Number(user.id) % 3 ? "None" : "1"} />
              <Row label="Type of Residence" value={Number(user.id) % 2 ? "Parent's Apartment" : "Rented"} />
            </div>
            <div className={styles.sectionDivider} />

          </section>


          <section className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>Education and Employment</h3>
            <div className={styles.grid}>
              <Row label="Level of Education" value={(Number(user.id) % 3 ? "B.Sc" : "M.Sc")} />
              <Row label="Employment Status" value={Number(user.id) % 2 ? "Employed" : "Self-Employed"} />
              <Row label="Sector of Employment" value={Number(user.id) % 2 ? "FinTech" : "Banking"} />
              <Row label="Duration of Employment" value={`${(Number(user.id) % 5) + 1} years`} />
              <Row label="Office Email" value={user.email} />
              <Row label="Monthly Income" value="₦200,000.00 - ₦400,000.00" />
              <Row label="Loan Repayment" value="40,000" />
            </div>
            <div className={styles.sectionDivider} />

          </section>


          <section className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>Socials</h3>
            <div className={styles.grid}>
              <Row label="Twitter" value={`@${user.username.split(" ")[0].toLowerCase()}`} />
              <Row label="Facebook" value={user.username} />
              <Row label="Instagram" value={`@${user.username.split(" ")[0].toLowerCase()}`} />
            </div>
            <div className={styles.sectionDivider} />

          </section>


          <section className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>Guarantor</h3>
            <div className={styles.grid}>
              <Row label="Full Name" value={"Debby Ogana"} />
              <Row label="Phone Number" value={"07060780922"} />
              <Row label="Email Address" value={"debby@mail.com"} />
              <Row label="Relationship" value={"Sister"} />
            </div>
            <div className={styles.sectionDivider} />

          </section>
        </div>
      )}

      {tab !== "general" && (
        <div className={styles.sectionCard}>
          <p>Placeholder for the “{tab}” section using mock data.</p>
        </div>
      )}
    </main>
  );
}
