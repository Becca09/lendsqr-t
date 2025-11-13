"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/users.module.scss";
import { seedUsers, type User, type UserStatus } from "../../lib/users";
import { MoreVertical, Eye, Ban, UserCheck, UserX, ChevronLeft, ChevronRight, ListFilter } from "lucide-react";

const PAGE_SIZES = [10, 20, 50, 100];

function StatCard({ title, value, icon, tint }: { title: string; value: number | string; icon: string; tint: "iconPink" | "iconPurple" | "iconPeach" | "iconRose" }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statTop}>
        <span className={`${styles.statIcon} ${styles[tint]}`}>
          <img src={icon} alt="" />
        </span>
      </div>
      <div className={styles.statTitle}>{title}</div>
      <div className={styles.statValue}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, { fg: string; bg: string }> = {
    Active: { fg: "#39CD62", bg: "#39CD6218" },
    Pending: { fg: "#E9B200", bg: "#E9B20018" },
    Inactive: { fg: "#545F7D", bg: "#545F7D18" },
    Blacklisted: { fg: "#E4033B", bg: "#E4033B18" },
  };
  return (
    <span className={styles.status} style={{ color: map[status].fg, background: map[status].bg }}>
      {status}
    </span>
  );
}

type Filters = {
  organization: string;
  username: string;
  email: string;
  phone: string;
  date: string; 
  status: UserStatus | "All";
};

const defaultFilters: Filters = {
  organization: "",
  username: "",
  email: "",
  phone: "",
  date: "",
  status: "All",
};

export default function UsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
  const [counts, setCounts] = useState({ total: 0, active: 0, withLoans: 0, withSavings: 0 });
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [openFilter, setOpenFilter] = useState<null | number>(null); // which header index
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [openMenuFor, setOpenMenuFor] = useState<null | string>(null); // user.id
  const regionRef = useRef<HTMLDivElement>(null);
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const [filterTop, setFilterTop] = useState<number>(0);

  const dateFmt = useMemo(() => new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }), []);
  const formatDate = (iso: string) => {
    const s = dateFmt.format(new Date(iso));
    return s.replace(', ', ' ');
  };

  useEffect(() => {
    try {
      if (localStorage.getItem("auth") !== "1") router.replace("/login");
    } catch {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    seedUsers();
    try {
      const all: User[] = JSON.parse(localStorage.getItem("users") || "[]");
      setAllUsers(all);
      const totalCount = all.length;
      const active = all.filter((u) => u.status === "Active").length;
      const withLoans = Math.round(totalCount * 0.05);
      const withSavings = Math.round(totalCount * 0.4);
      setCounts({ total: totalCount, active, withLoans, withSavings });
    } catch {
      setAllUsers([]);
    }
  }, []);

  const filtered = useMemo(() => {
    let out = allUsers.slice();
    if (filters.organization) out = out.filter((u) => u.organization.toLowerCase().includes(filters.organization.toLowerCase()));
    if (filters.username) out = out.filter((u) => u.username.toLowerCase().includes(filters.username.toLowerCase()));
    if (filters.email) out = out.filter((u) => u.email.toLowerCase().includes(filters.email.toLowerCase()));
    if (filters.phone) out = out.filter((u) => u.phoneNumber.includes(filters.phone));
    if (filters.date) {
      out = out.filter((u) => new Date(u.dateJoined).toISOString().slice(0, 10) === filters.date);
    }
    if (filters.status !== "All") out = out.filter((u) => u.status === filters.status);
    return out;
  }, [allUsers, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const pageItems = useMemo(() => {
    const items: (number | '…')[] = [];
    const last = totalPages;
    const cur = page;
    if (last <= 7) {
      for (let n = 1; n <= last; n++) items.push(n);
      return items;
    }
    if (cur <= 3) {
      items.push(1, 2, 3, '…', last - 1, last);
      return items;
    }
    if (cur >= last - 2) {
      items.push(1, '…', last - 2, last - 1, last);
      return items;
    }

    items.push(1, '…', cur - 1, cur, cur + 1, '…', last);
    return items;
  }, [page, totalPages]);

  useEffect(() => {
    const onClick = () => {
      setOpenFilter(null);
      setOpenMenuFor(null);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const update = () => {
      if (regionRef.current && tableWrapRef.current) {
        const top = tableWrapRef.current.offsetTop; 
        setFilterTop(Math.max(0, top - 2)); 
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [openFilter]);

  return (
    <main className={styles.page}>
      <p className={styles.h1}>Users</p>

      <div className={styles.statsRow}>
        <StatCard title="USERS" value={counts.total} icon="/images/users.png" tint="iconPink" />
        <StatCard title="ACTIVE USERS" value={counts.active} icon="/images/active-users.png" tint="iconPurple" />
        <StatCard title="USERS WITH LOANS" value={counts.withLoans} icon="/images/users-loan.png" tint="iconPeach" />
        <StatCard title="USERS WITH SAVINGS" value={counts.withSavings} icon="/images/users-savings.png" tint="iconRose" />
      </div>

      <div className={styles.tableRegion} ref={regionRef}>
        {openFilter !== null && (
          <div className={styles.filterPanelGlobal} style={{ top: filterTop }} onClick={(e) => e.stopPropagation()}>
            <FilterForm
              values={filters}
              onChange={setFilters}
              onReset={() => { setFilters(defaultFilters); setOpenFilter(null); setPage(1); }}
              onApply={() => { setOpenFilter(null); setPage(1); }}
              columnIndex={openFilter}
            />
          </div>
        )}

        {/* Mobile filter trigger */}
        <div className={styles.mobileFilterBar} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={styles.mobileFilterBtn}
            onClick={() => setOpenFilter(0)}
          >
            <ListFilter size={16} /> Filter
          </button>
        </div>

        <div className={styles.mobileList}>
          {pageData.length > 0 ? pageData.map((u) => (
            <div key={u.id} className={styles.mCard}>
              <div className={styles.mRow}><span className={styles.mLabel}>Organization</span><span className={styles.mValue}>{u.organization}</span></div>
              <div className={styles.mRow}><span className={styles.mLabel}>Username</span><span className={styles.mValue}>{u.username}</span></div>
              <div className={styles.mRow}><span className={styles.mLabel}>Email</span><span className={styles.mValue}>{u.email}</span></div>
              <div className={styles.mRow}><span className={styles.mLabel}>Phone</span><span className={styles.mValue}>{u.phoneNumber}</span></div>
              <div className={styles.mRow}><span className={styles.mLabel}>Date Joined</span><span className={styles.mValue}>{formatDate(u.dateJoined)}</span></div>
              <div className={styles.mRow}><span className={styles.mLabel}>Status</span><span className={styles.mValue}><StatusBadge status={u.status} /></span></div>
              <div className={styles.mActions}>
                <button className={styles.mAction} type="button" onClick={() => router.push(`/users/${u.id}`)}><Eye size={16} /> View Details</button>
                <button className={styles.mAction} type="button" onClick={() => alert(`Blacklisted ${u.username}`)}><UserX size={16} /> Blacklist</button>
                <button className={styles.mAction} type="button" onClick={() => alert(`Activated ${u.username}`)}><UserCheck size={16} /> Activate</button>
              </div>
            </div>
          )) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>No matching users</p>
              <p className={styles.emptyHint}>Try adjusting your filters</p>
            </div>
          )}
        </div>

        <div className={styles.tableWrap} ref={tableWrapRef}>
          <table className={styles.table}>
            <thead>
              <tr>
                {[
                  "ORGANIZATION",
                  "USERNAME",
                  "EMAIL",
                  "PHONE NUMBER",
                  "DATE JOINED",
                  "STATUS",
                  "",
                ].map((hdr, i) => (
                  <th key={i}>
                    <div className={styles.thInner}>
                      <span>{hdr}</span>
                      {i !== 6 && (
                        <button className={styles.tinyIconBtn} onClick={(e) => { e.stopPropagation(); setOpenFilter((p) => (p === i ? null : i)); }}>
                          <ListFilter  size={12} />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.length > 0 ? pageData.map((u) => (
                <tr key={u.id}>
                  <td>{u.organization}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.phoneNumber}</td>
                  <td>{formatDate(u.dateJoined)}</td>
                  <td><StatusBadge status={u.status} /></td>
                  <td>
                    <div className={styles.menuWrap}>
                      <button className={styles.moreBtn} onClick={(e) => { e.stopPropagation(); setOpenMenuFor((p) => (p === u.id ? null : u.id)); }}>
                        <MoreVertical size={16} />
                      </button>
                      {openMenuFor === u.id && (
                        <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
                          <button
                            className={styles.menuItem}
                            type="button"
                            onClick={() => { setOpenMenuFor(null); router.push(`/users/${u.id}`); }}
                          >
                            <Eye size={16} /> <span>View Details</span>
                          </button>
                          <button className={styles.menuItem} type="button" onClick={() => alert(`Blacklisted ${u.username}`)}>
                            <UserX  size={16} /> <span>Blacklist User</span>
                          </button>
                          <button className={styles.menuItem} type="button" onClick={() => alert(`Activated ${u.username}`)}>
                            <UserCheck size={16} /> <span>Activate User</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7}>
                    <div className={styles.emptyState}>
                      <p className={styles.emptyTitle}>No matching users</p>
                      <p className={styles.emptyHint}>Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.pagerRow}>
        <div className={styles.showing}>
          <span>Showing</span>
          <span className={styles.pageSizeWrap}>
            <select
              className={styles.pageSizeSelect}
              value={pageSize}
              onChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(1); }}
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </span>
          <span>out of {filtered.length}</span>
        </div>
        <div className={styles.pager}>
          <button className={styles.pageNav} disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <ChevronLeft size={16} />
          </button>
          <div className={styles.pageNums}>
            {pageItems.map((it, idx) => (
              it === '…' ? (
                <span key={`e${idx}`} className={styles.ellipsis}>…</span>
              ) : (
                <button
                  key={it}
                  className={`${styles.pageNum} ${it === page ? styles.activePage : ''}`}
                  onClick={() => setPage(it)}
                >
                  {it}
                </button>
              )
            ))}
          </div>
          <button className={styles.pageNav} disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </main>
  );
}

function FilterForm({ values, onChange, onReset, onApply, columnIndex }: {
  values: Filters;
  onChange: (v: Filters) => void;
  onReset: () => void;
  onApply: () => void;
  columnIndex: number;
}) {
  return (
    <div className={styles.filterForm}>
      <div className={styles.fGroup}>
        <label>Organization</label>
        <input value={values.organization} onChange={(e) => onChange({ ...values, organization: e.target.value })} placeholder="Select" />
      </div>
      <div className={styles.fGroup}>
        <label>Username</label>
        <input value={values.username} onChange={(e) => onChange({ ...values, username: e.target.value })} placeholder="User" />
      </div>
      <div className={styles.fGroup}>
        <label>Email</label>
        <input value={values.email} onChange={(e) => onChange({ ...values, email: e.target.value })} placeholder="Email" />
      </div>
      <div className={styles.fGroup}>
        <label>Date</label>
        <input type="date" value={values.date} onChange={(e) => onChange({ ...values, date: e.target.value })} />
      </div>
      <div className={styles.fGroup}>
        <label>Phone Number</label>
        <input value={values.phone} onChange={(e) => onChange({ ...values, phone: e.target.value })} placeholder="Phone Number" />
      </div>
      <div className={styles.fGroup}>
        <label>Status</label>
        <select value={values.status} onChange={(e) => onChange({ ...values, status: e.target.value as Filters["status"] })}>
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Pending</option>
          <option>Blacklisted</option>
        </select>
      </div>

      <div className={styles.fActions}>
        <button type="button" className={styles.resetBtn} onClick={onReset}>Reset</button>
        <button type="button" className={styles.filterBtn} onClick={onApply}>Filter</button>
      </div>
    </div>
  );
}


