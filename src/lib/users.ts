// Client-side mock data generator and access helpers
// Generates 500 deterministic users and stores them in localStorage on first use

export type UserStatus = "Active" | "Inactive" | "Pending" | "Blacklisted";

export type User = {
  id: string;
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string; // ISO string
  status: UserStatus;
};

const STORAGE_KEY = "users";
const DATA_VERSION = 5; // bump when generator schema changes

// Simple deterministic PRNG
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0);
}

const orgs = [
  "Lendsqr", "Irorun", "Lendstar", "BorrowMe", "iPay", "Seed", "Zentra", "CrediWave", "FlexiFund", "NovaLend", "SwiftCredit", "LoanLink", "PrimeAdvance", "EasyCap", "FundSure", "QuickVest", "ZenithLoans", "CashPilot", "Lendora", "SurePadi", "TrustHive", "CreditVille", "FundFlow", "BridgeLoan", "LendWise", "PledgePoint", "MoneySprint", "SmartCredit", "KoloTrust", "Fundora", "LoanMate", "CashBridge", "FastFund", "CrediPoint", "BlueVest", "LoanEdge", "EasyLend", "CredSure", "QuickRelief", "GrowCredit"
];

const firstNames = [
  "Grace", "Tosin", "Debby", "Alex", "Mariam", "John", "Ada", "Tola", "Seyi", "Kemi",
  "David", "Bola", "Chika", "Emeka", "Lara", "Michael", "Femi", "Ngozi", "Tunde", "Amaka",
  "Samuel", "Ruth", "Damilola", "Ife", "Pelumi", "Victor", "Olamide", "Esther", "Henry", "Joy",
  "Precious", "Chioma", "Bolaji", "Gbenga", "Helen", "Stephen", "Omotola", "Faith", "Jide", "Nancy",
  "Opeyemi", "Kingsley", "Oluwadamilare", "Anita", "Tope", "Olumide", "Shola", "Kehinde", "Daniel", "Rebecca"
];

const lastNames = [
  "Effiom", "Dokunmu", "Ogana", "Adeyemi", "Okafor", "James", "Abiola", "Oshodi", "Popoola", "Bello",
  "Adewale", "Eze", "Ogunleye", "Balogun", "Daniels", "Lawal", "Ojo", "Nwosu", "Okoro", "Taiwo",
  "Agbaje", "Mohammed", "Akinola", "Ekanem", "Obi", "Yusuf", "Olatunji", "Chukwu", "Adeleke", "Salami",
  "Uche", "Adebanjo", "Ogunbiyi", "Olawale", "Afolabi", "Ajayi", "Ogunjimi", "Ogunlade", "Okonkwo", "Ogunmola",
  "Oyeniran", "Alabi", "Onwuka", "Odunsi", "Adewumi", "Suleiman", "Bamidele", "Ogundipe", "Egbeyemi", "Ibrahim"
];

const statuses: UserStatus[] = ["Active", "Inactive", "Pending", "Blacklisted"];

function pad(n: number, len = 11) {
  return ("" + n).padStart(len, "0");
}

function orgDomain(org: string) {
  const slug = org.toLowerCase().replace(/[^a-z0-9]+/g, "");
  return `${slug}.com`;
}

function buildUsers(count = 500): User[] {
  const rand = lcg(12345);
  const users: User[] = [];
  const ngPrefixes = ["070", "080", "081", "090", "091"]; // common NG prefixes
  for (let i = 1; i <= count; i++) {
    const fn = firstNames[(rand() % firstNames.length) | 0];
    const ln = lastNames[(rand() % lastNames.length) | 0];
    const username = `${fn} ${ln}`; // full name
    // Nigerian format: 11 digits total using realistic prefixes
    const prefix = ngPrefixes[(rand() % ngPrefixes.length) | 0];
    const tail = pad((rand() % 100_000_000) | 0, 8);
    const phoneNumber = `${prefix}${tail}`;
    const timestamp = Date.now() - ((rand() % (1_000 * 60 * 60 * 24 * 365)) | 0);
    const dateJoined = new Date(timestamp).toISOString();
    const organization = orgs[(rand() % orgs.length) | 0];
    const email = `${fn.toLowerCase()}@${orgDomain(organization)}`;
    const status = statuses[(rand() % statuses.length) | 0];
    users.push({ id: String(i), organization, username, email, phoneNumber, dateJoined, status });
  }
  return users;
}

export function seedUsers(): void {
  if (typeof window === "undefined") return;
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    const versionKey = `${STORAGE_KEY}:v`;
    const existingVersion = localStorage.getItem(versionKey);
    if (!existing || existingVersion !== String(DATA_VERSION)) {
      const data = buildUsers(500);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(versionKey, String(DATA_VERSION));
    }
  } catch { }
}

export type ListParams = { page?: number; size?: number; search?: string; status?: UserStatus | "All" };

export function getUsers(params: ListParams = {}): { data: User[]; total: number } {
  if (typeof window === "undefined") return { data: [], total: 0 };
  const { page = 1, size = 100, search = "", status = "All" } = params;
  seedUsers();
  let all: User[] = [];
  try {
    all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { }
  const q = search.trim().toLowerCase();
  let filtered = all.filter((u) =>
    !q ||
    u.username.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q) ||
    u.organization.toLowerCase().includes(q) ||
    u.phoneNumber.includes(q)
  );
  if (status !== "All") filtered = filtered.filter((u) => u.status === status);
  const total = filtered.length;
  const start = (page - 1) * size;
  const data = filtered.slice(start, start + size);
  return { data, total };
}

export function getUserById(id: string): User | null {
  if (typeof window === "undefined") return null;
  seedUsers();
  try {
    const all: User[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return all.find((u) => u.id === id) || null;
  } catch {
    return null;
  }
}
