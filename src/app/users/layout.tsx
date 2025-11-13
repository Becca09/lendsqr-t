"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", flexDirection: "column" }}>
      <Topbar onMenu={() => setDrawerOpen(true)} />
      <Sidebar variant="drawer" open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div style={{ padding: 24, flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}
