export interface GroupMember {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

export interface GroupItem {
  id: string;
  name: string;
  location: string;
  avatarLetters: string;
  category?: string;
  description: string;
  createdAt: string;
  membersCount: number;
  members: GroupMember[];
  isPrivate?: boolean;
  joined?: boolean;
}

export const DEFAULT_GROUPS: GroupItem[] = [
  {
    id: "grp-1",
    name: "qurani",
    location: "Malang - Jawa Timur",
    avatarLetters: "Q",
    category: "Quran Memorization",
    description: "No description available",
    createdAt: "11 Oct 2026",
    membersCount: 2,
    members: [
      { id: "mem-1", name: "nanas nanas", username: "@nanas" },
      { id: "mem-2", name: "indi", username: "@indiagri" },
      { id: "mem-3", name: "02_Alvia Agustin", username: "@alvia" },
    ],
    joined: true,
    isPrivate: false,
  },
  {
    id: "grp-2",
    name: "qurani group",
    location: "Malang - Jawa Timur",
    avatarLetters: "QG",
    category: "Tahfidz",
    description: "No description available",
    createdAt: "12 Oct 2026",
    membersCount: 1,
    members: [
      { id: "mem-1", name: "nanas nanas", username: "@nanas" },
      { id: "mem-2", name: "02_Alvia Agustin", username: "@alvia" },
      { id: "mem-3", name: "fatkul", username: "@fatkul" },
      { id: "mem-4", name: "Ahmad Fauzan", username: "@fauzan" },
    ],
    joined: true,
    isPrivate: false,
  },
];

export function getStoredGroups(): GroupItem[] {
  if (typeof window === "undefined") return DEFAULT_GROUPS;
  try {
    const saved = localStorage.getItem("qurani_user_groups");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge stored with DEFAULT_GROUPS without duplicating
        const list = [...parsed];
        DEFAULT_GROUPS.forEach((def) => {
          if (!list.some((item) => item.name.toLowerCase() === def.name.toLowerCase())) {
            list.push(def);
          }
        });
        return list;
      }
    }
  } catch {}
  return DEFAULT_GROUPS;
}
