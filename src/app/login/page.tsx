"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "../../styles/login.module.scss";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = useMemo(() => {
    if (!email || !password) return false;
    return /.+@.+\..+/.test(email) && password.length >= 6;
  }, [email, password]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const EMAIL = "user@lendsqr.com";
    const PASSWORD = "password";
    if (email.trim().toLowerCase() === EMAIL && password === PASSWORD) {
      try {
        localStorage.setItem("auth", "1");
      } catch {}
      router.push("/users");
      return;
    }
    setError("Invalid email or password");
  }

  return (
    <div className={styles.page}>
      <Image className={styles.pageLogo} src="/images/logo.svg" alt="Lendsqr logo" width={140} height={36} priority />
      <div className={styles.left}>
        <div className={styles.illustration}>
          <Image src="/images/pablo-sign-in.svg" alt=" Sign-in Illustration" width={520} height={420} priority />
        </div>
      </div>

      <section className={styles.right}>
        <div className={styles.card}>
          <h1 className={styles.title}>Welcome!</h1>
          <p className={styles.subtitle}>Enter details to login.</p>

          <form className={styles.form} onSubmit={onSubmit}>
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className={styles.passwordWrap}>
              <input
                className={styles.input}
                type={show ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className={styles.showBtn}
                onClick={() => setShow((s) => !s)}
              >
                {show ? "HIDE" : "SHOW"}
              </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}

            <Link className={styles.forgot} href="#">FORGOT PASSWORD?</Link>

            <button className={styles.button} disabled={!valid} type="submit">
              LOG IN
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
