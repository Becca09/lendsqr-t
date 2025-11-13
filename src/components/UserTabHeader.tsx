import React from "react";
import styles from "../styles/user-details.module.scss";
import { User } from "lucide-react";

type Props = {
  user: {
    id: string;
    username: string;
  };
  activeTab: string;
  onChangeTab: (k: string) => void;
};

export default function UserTabHeader({ user, activeTab, onChangeTab }: Props) {
 

  return (
    <div className={styles.headerCard}>
      <div className={styles.headRow}>
        <div className={styles.leftCol}>
          <div className={styles.avatar}><User width={25} height={25} /></div>
          <div className={styles.titleWrap}>
            <div className={styles.name}>{user.username}</div>
            <div className={styles.uid}>{user.id}LSQFf587g90</div>
          </div>
        </div>

        <div className={styles.metaCol}>
          <i className={styles.vbar} />
          <div className={styles.kv}>
            <div className={styles.kLabel}>User's Tier</div>
            <div className={styles.kValue}>★ ★ ☆</div>
          </div>
          <i className={styles.vbar} />
          <div className={styles.kv}>
            <div className={styles.balance}>₦200,000.00</div>
            <div className={styles.subtext}>{`${user.id.padStart(10, "0")}/Providus Bank`}</div>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { key: "general", label: "General Details" },
          { key: "documents", label: "Documents" },
          { key: "bank", label: "Bank Details" },
          { key: "loans", label: "Loans" },
          { key: "savings", label: "Savings" },
          { key: "app", label: "App and System" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => onChangeTab(t.key)}
            className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
