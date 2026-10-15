// TODO: Hapus seluruh file ini setelah API GET Friends/Groups/Members sudah siap 
// dan berfungsi normal di backend. File ini HANYA untuk simulasi UI sementara.

import { UserWithFriendshipStatus } from "@/utils/api/friends";
import { Grup, GroupMember } from "@/types/grup";

export const MOCK_FRIENDS: UserWithFriendshipStatus[] = [
  { id: "83837772791545857", name: "alvia", username: "alvia", nickname: "alvia", friendshipStatus: "friends", isVerify: true },
  { id: "89158751637995521", name: "via", username: "via", nickname: "via", friendshipStatus: "friends", isVerify: true },
  { id: "91234567890123456", name: "Refan", username: "refan", nickname: "refan", friendshipStatus: "friends", isVerify: true },
  { id: "91234567890123457", name: "Raja", username: "raja", nickname: "raja", friendshipStatus: "friends", isVerify: true },
  { id: "91234567890123458", name: "Virly", username: "virly", nickname: "virly", friendshipStatus: "friends", isVerify: true },
  { id: "91234567890123459", name: "Alvasya", username: "alvasya", nickname: "alvasya", friendshipStatus: "friends", isVerify: true },
  { id: "91234567890123460", name: "Iqbal", username: "iqbal", nickname: "iqbal", friendshipStatus: "friends", isVerify: true },
];

export const MOCK_GROUPS: Grup[] = [
  { id: "grp-001", name: "Qurani", description: "Grup pengajian harian", is_private: false, photo_path: null },
  { id: "grp-002", name: "Rumah Quran", description: "Grup rumah tahfidz", is_private: false, photo_path: null },
  { id: "grp-003", name: "Ngaji Bersama", description: "Grup ngaji komunitas", is_private: false, photo_path: null },
  { id: "grp-004", name: "Tahsin Center", description: "Grup pembinaan tahsin", is_private: false, photo_path: null },
  { id: "grp-005", name: "Majelis Al-Furqan", description: "Grup majelis taklim", is_private: false, photo_path: null },
];

export const MOCK_MEMBERS_BY_GROUP: Record<string, GroupMember[]> = {
  "grp-001": [
    { id: "mem-001", role: "admin", user_id: "91234567890123456", grup_id: "grp-001", created_at: new Date().toISOString(), user: { id: "91234567890123456", name: "Refan", username: "refan", nickname: "refan" } as any },
    { id: "mem-002", role: "member", user_id: "83837772791545857", grup_id: "grp-001", created_at: new Date().toISOString(), user: { id: "83837772791545857", name: "alvia", username: "alvia", nickname: "alvia" } as any },
  ],
  "grp-002": [
    { id: "mem-003", role: "admin", user_id: "91234567890123457", grup_id: "grp-002", created_at: new Date().toISOString(), user: { id: "91234567890123457", name: "Raja", username: "raja", nickname: "raja" } as any },
    { id: "mem-004", role: "member", user_id: "89158751637995521", grup_id: "grp-002", created_at: new Date().toISOString(), user: { id: "89158751637995521", name: "via", username: "via", nickname: "via" } as any },
  ],
  "grp-003": [
    { id: "mem-005", role: "member", user_id: "91234567890123458", grup_id: "grp-003", created_at: new Date().toISOString(), user: { id: "91234567890123458", name: "Virly", username: "virly", nickname: "virly" } as any },
  ],
  "grp-004": [
    { id: "mem-006", role: "member", user_id: "91234567890123459", grup_id: "grp-004", created_at: new Date().toISOString(), user: { id: "91234567890123459", name: "Alvasya", username: "alvasya", nickname: "alvasya" } as any },
  ],
  "grp-005": [
    { id: "mem-007", role: "member", user_id: "91234567890123460", grup_id: "grp-005", created_at: new Date().toISOString(), user: { id: "91234567890123460", name: "Iqbal", username: "iqbal", nickname: "iqbal" } as any },
  ],
};
