import Link from "next/link";
import styles from "../styles/not-found.module.scss";

export default function NotFound() {
  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.text}>The page you are looking for does not exist.</p>
        <div className={styles.linkWrap}>
          <Link href="/users" className={styles.back}>
            Go back to Users
          </Link>
        </div>
      </div>
    </main>
  );
}
