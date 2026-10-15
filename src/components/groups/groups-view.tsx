"use client";

import * as React from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  Crown,
  Settings,
  MoreVertical,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CreateGroupModal } from "./create-group-modal";
import { DEFAULT_GROUPS, getStoredGroups, GroupItem } from "@/data/group-data";

// Custom 4-diamonds icon for Groups matching Qurani design exactly
export function GroupsHeaderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || "size-6"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15 5 12 8 9 5" />
      <polygon points="19 9 22 12 19 15 16 12" />
      <polygon points="12 16 15 19 12 22 9 19" />
      <polygon points="5 9 8 12 5 15 2 12" />
    </svg>
  );
}

export function GroupsView() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState<string>("all");
  const [groups, setGroups] = React.useState<GroupItem[]>(() => getStoredGroups());
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [managedGroup, setManagedGroup] = React.useState<GroupItem | null>(null);

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Sync groups from localStorage dynamically
  React.useEffect(() => {
    const sync = () => {
      setGroups(getStoredGroups());
    };
    sync();
    window.addEventListener("qurani_groups_updated", sync);
    return () => window.removeEventListener("qurani_groups_updated", sync);
  }, []);

  const handleTopSearchClick = () => {
    searchInputRef.current?.focus();
  };

  // Filtered groups based on search query
  const filteredGroups = React.useMemo(() => {
    return groups.filter((g) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        g.name.toLowerCase().includes(q) ||
        (g.description && g.description.toLowerCase().includes(q)) ||
        (g.location && g.location.toLowerCase().includes(q));

      const matchesCategory =
        filterCategory === "all" ||
        (g.category && g.category.toLowerCase() === filterCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [groups, searchQuery, filterCategory]);

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 max-w-[1600px] w-full select-none">
      {/* Top Header Row (Matching Screenshot 4) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GroupsHeaderIcon className="size-6 text-gray-800" />
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Groups
          </h1>
        </div>

        {/* Action Buttons: + Create & Search */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00875a] hover:bg-[#00734c] text-white text-xs sm:text-sm font-semibold shadow-2xs transition cursor-pointer"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Create</span>
          </button>

          <button
            type="button"
            onClick={handleTopSearchClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00875a] hover:bg-[#00734c] text-white text-xs sm:text-sm font-semibold shadow-2xs transition cursor-pointer"
          >
            <Search className="size-4 stroke-[2.5]" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar (Matching Screenshot 4) */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 stroke-[2]" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#00875a] shadow-2xs transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Funnel Filter Icon Button (Emerald Green Square Button) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="size-11 rounded-xl bg-[#00875a] hover:bg-[#00734c] text-white flex items-center justify-center shrink-0 shadow-2xs transition cursor-pointer focus:outline-none"
              title="Filter categories"
            >
              <Filter className="size-4 stroke-[2.2]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl bg-white border border-gray-100">
            <DropdownMenuLabel className="text-xs font-semibold text-gray-500 px-2 py-1.5">
              Filter by Category
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setFilterCategory("all")}
              className={`text-xs cursor-pointer rounded-xl px-2.5 py-2 ${filterCategory === "all" ? "bg-emerald-50 text-[#00875a] font-semibold" : ""}`}
            >
              All Categories
            </DropdownMenuItem>
            {[
              "Quran Memorization",
              "Tahfidz",
              "Tahsin",
              "Keluarga",
              "Komunitas",
              "Masjid/Musholla",
              "Pesantren",
              "Umum",
            ].map((cat) => (
              <DropdownMenuItem
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`text-xs cursor-pointer rounded-xl px-2.5 py-2 ${filterCategory === cat ? "bg-emerald-50 text-[#00875a] font-semibold" : ""}`}
              >
                {cat}
              </DropdownMenuItem>
            ))}
            {filterCategory !== "all" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setFilterCategory("all")}
                  className="text-xs text-red-600 cursor-pointer rounded-xl px-2.5 py-2"
                >
                  Reset filter
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Subheading: Groups (count) */}
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <GroupsHeaderIcon className="size-4 text-gray-700" />
        <span>Groups ({filteredGroups.length})</span>
      </div>

      {/* Groups Cards Grid (Matching Screenshot 4) */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-2xs flex flex-col items-center justify-center">
          <div className="size-16 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mb-3">
            <Users className="size-8" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-semibold text-gray-800">No groups found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm">
            {searchQuery
              ? `No groups matching "${searchQuery}"`
              : "Create a group to start collaborating and reciting together."}
          </p>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 px-5 py-2 rounded-xl bg-[#00875a] hover:bg-[#00734c] text-white text-xs font-semibold shadow-2xs transition"
          >
            Create Group
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGroups.map((group) => {
            const avatarText =
              group.avatarLetters ||
              group.name
                .split(/\s+/)
                .map((w) => w[0]?.toUpperCase())
                .join("")
                .slice(0, 2) ||
              "Q";

            return (
              <div
                key={group.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Top Dark Slate Banner */}
                <div className="bg-[#1e293b] p-5 flex items-center justify-between text-white relative">
                  <div className="flex items-center gap-3.5">
                    {/* Avatar with White Border & Crown Badge */}
                    <div className="relative shrink-0">
                      <div className="size-14 rounded-full border-2 border-white bg-[#1e293b] flex items-center justify-center text-white font-bold text-lg select-none">
                        {avatarText}
                      </div>
                      {/* Orange Crown Badge */}
                      <span className="absolute -top-1 -right-1 size-5 rounded-full bg-[#f59e0b] border-2 border-[#1e293b] text-white flex items-center justify-center text-[10px] shadow-xs">
                        <Crown className="size-3 fill-white text-white" />
                      </span>
                    </div>

                    {/* Group Title and Location */}
                    <div>
                      <h3 className="font-bold text-white text-base sm:text-lg leading-tight">
                        {group.name}
                      </h3>
                      <p className="text-xs text-gray-300 mt-1 font-normal">
                        {group.location || "Malang - Jawa Timur"}
                      </p>
                    </div>
                  </div>

                  {/* Three dots menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition focus:outline-none"
                      >
                        <MoreVertical className="size-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-xl p-1 shadow-lg bg-white">
                      <DropdownMenuItem
                        onClick={() => setManagedGroup(group)}
                        className="text-xs cursor-pointer rounded-lg px-2.5 py-1.5"
                      >
                        Manage Group
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href);
                          toast.success("Link grup disalin!");
                        }}
                        className="text-xs cursor-pointer rounded-lg px-2.5 py-1.5"
                      >
                        Copy Link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Bottom Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-500 font-normal">
                    {group.description || "No description available"}
                  </p>

                  {/* Date & Members Info Row */}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
                    <span>{group.createdAt || "11 Oct 2026"}</span>
                    <span className="flex items-center gap-1.5">
                      <Users className="size-3.5 text-gray-400" />
                      <span>{group.membersCount || group.members?.length || 1} Members</span>
                    </span>
                  </div>

                  {/* Manage Button */}
                  <button
                    type="button"
                    onClick={() => setManagedGroup(group)}
                    className="w-full py-2.5 rounded-xl bg-[#00875a] hover:bg-[#00734c] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer"
                  >
                    <Settings className="size-4 stroke-[2.2]" />
                    <span>Manage</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manage Group Dialog */}
      {managedGroup && (
        <Dialog open={Boolean(managedGroup)} onOpenChange={(open) => !open && setManagedGroup(null)}>
          <DialogContent className="max-w-md rounded-2xl p-6 bg-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Settings className="size-5 text-[#00875a]" />
                <span>Kelola Grup: {managedGroup.name}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Informasi dan daftar anggota dalam grup {managedGroup.name} ({managedGroup.location}).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Lokasi</span>
                  <span className="font-medium text-gray-800">{managedGroup.location}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Dibuat</span>
                  <span className="font-medium text-gray-800">{managedGroup.createdAt}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Jumlah Anggota</span>
                  <span className="font-medium text-gray-800">{managedGroup.membersCount} Orang</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Anggota Grup</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(managedGroup.members || []).map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-white"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full bg-emerald-100 text-[#00875a] font-bold text-xs flex items-center justify-center">
                          {m.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-900">{m.name}</div>
                          <div className="text-[11px] text-gray-400">{m.username}</div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                        Anggota
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Group Modal matching live site 1:1 */}
      <CreateGroupModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onGroupCreated={(newGrp) => {
          const newItem: GroupItem = {
            id: newGrp.id,
            name: newGrp.name,
            location: `${(newGrp as any).city || "Malang"} - ${(newGrp as any).province || "Jawa Timur"}`,
            avatarLetters: newGrp.name
              .split(/\s+/)
              .map((w) => w[0]?.toUpperCase())
              .join("")
              .slice(0, 2) || "Q",
            category: newGrp.category || "Umum",
            description: newGrp.description || "No description available",
            createdAt: "15 Oct 2026",
            membersCount: 1,
            members: [
              { id: "mem-owner", name: "indi", username: "@indiagri" },
            ],
            joined: true,
            isPrivate: false,
          };

          const updated = [newItem, ...groups];
          setGroups(updated);
          try {
            localStorage.setItem("qurani_user_groups", JSON.stringify(updated));
            window.dispatchEvent(new Event("qurani_groups_updated"));
          } catch {}
        }}
      />
    </div>
  );
}
