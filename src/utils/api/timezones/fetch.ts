import { TimezoneData } from "@/types/timezones";

export async function fetchTimezones(): Promise<{ success: boolean; data: TimezoneData[] }> {
  return {
    success: true,
    data: [
      { id: "1", name: "Asia/Jakarta", code: "WIB" },
      { id: "2", name: "Asia/Makassar", code: "WITA" },
      { id: "3", name: "Asia/Jayapura", code: "WIT" },
      { id: "4", name: "America/New_York", code: "EST" },
      { id: "5", name: "Asia/Riyadh", code: "AST" },
    ],
  };
}
