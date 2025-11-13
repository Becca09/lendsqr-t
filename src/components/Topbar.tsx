"use client";

import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import topStyles from "../styles/topbar.module.scss";

export default function Topbar({ onMenu }: { onMenu?: () => void }) {
  return (
    <header className={topStyles.topbar}>
      <div className={topStyles.container}>
        <div className={topStyles.left}>
          <a href="/" className={topStyles.brand} aria-label="Lendsqr">
            <img src="/images/logo.svg" alt="Lendsqr" width={112} height={24} />
          </a>
          <div className={topStyles.search}>
            <input className={topStyles.input} placeholder="Search for anything" />
            <button className={topStyles.searchBtn} aria-label="Search"><Search  width={15} height={15}/></button>
          </div>
        </div>
        <div className={topStyles.right}>
          <button className={topStyles.menuBtn} aria-label="Open menu" onClick={onMenu}>
            <Menu />
          </button>
          <a href="#" className={topStyles.docs}>Docs</a>
          <button className={topStyles.iconBtn} aria-label="Notifications"><Bell /></button>
          <div className={topStyles.user}>
            <img src ="/images/avatar.png" alt="user" width={32} height={32} className={topStyles.avatar} />
            <span className={topStyles.username}>Adedeji</span>
            <ChevronDown className={topStyles.chev} aria-hidden="true" />
          </div>
        </div>
      </div>
    </header>
  );
}
