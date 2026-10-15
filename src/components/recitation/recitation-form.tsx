"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, Check, Search, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "sonner";
import { CreateGroupModal } from "@/components/groups/create-group-modal";
import { SURAT_LIST, JUZ_LIST, HALAMAN_LIST, PRAQURAN_LIST } from "@/data/quran-data";
import { MOCK_FRIENDS } from "@/data/mock-setoran-data";
import { getStoredGroups, GroupItem, DEFAULT_GROUPS } from "@/data/group-data";

const quickSurahs = ["Al-Fatihah", "Yasin", "Al-Waqi'ah", "Al-Mulk"];
const quickJuz = [1, 29, 30];
const quickPages = [1, 2, 50, 604];
const quickYanbua = [
  { jilid: "yanbua-1", page: 1, label: "Jilid 1 Hal 1" },
  { jilid: "yanbua-1", page: 2, label: "Jilid 1 Hal 2" },
  { jilid: "yanbua-1", page: 3, label: "Jilid 1 Hal 3" },
  { jilid: "yanbua-2", page: 1, label: "Jilid 2 Hal 1" },
];

function RecitationRadioItem({
  checked,
  onChange,
  label,
  name,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  name: string;
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm font-medium text-gray-900 cursor-pointer select-none group">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`size-4 rounded-full border flex items-center justify-center transition-colors bg-white ${
          checked
            ? "border-gray-400"
            : "border-gray-300 group-hover:border-gray-400"
        }`}
      >
        {checked && <span className="size-2 rounded-full bg-black shrink-0" />}
      </span>
      <span>{label}</span>
    </label>
  );
}

interface RecitationFormProps {
  onRecitationAdded?: () => void;
  locale?: string;
}

export function RecitationForm({ locale = "en" }: RecitationFormProps) {
  const router = useRouter();

  const [reciterMode, setReciterMode] = React.useState<"friend" | "group">("group");
  const [selectedFriend, setSelectedFriend] = React.useState("");
  const [selectedGroup, setSelectedGroup] = React.useState("");
  const [selectedMember, setSelectedMember] = React.useState("");
  const [isMemberOpen, setIsMemberOpen] = React.useState(false);

  const [recitationType, setRecitationType] = React.useState<"tahsin" | "tahfidz" | "pra-quran">("tahsin");
  const [displayMode, setDisplayMode] = React.useState<"surah" | "juz" | "page">("surah");

  // Selected Surah, Juz, Page (null on initial/reset so it shows "Select Surah", chips inactive matching Screenshot 1!)
  const [selectedSurahId, setSelectedSurahId] = React.useState<number | null>(null);
  const [selectedJuzId, setSelectedJuzId] = React.useState<number | null>(null);
  const [selectedPageId, setSelectedPageId] = React.useState<number | null>(null);

  // Pra Quran state
  const [selectedPraquranJilid, setSelectedPraquranJilid] = React.useState<string>("yanbua-1");
  const [selectedPraquranPage, setSelectedPraquranPage] = React.useState<number>(1);
  const [isPraquranJilidOpen, setIsPraquranJilidOpen] = React.useState(false);
  const [isPraquranPageOpen, setIsPraquranPageOpen] = React.useState(false);

  const [isSurahOpen, setIsSurahOpen] = React.useState(false);
  const [isJuzOpen, setIsJuzOpen] = React.useState(false);
  const [isPageOpen, setIsPageOpen] = React.useState(false);
  const [isFriendOpen, setIsFriendOpen] = React.useState(false);
  const [isGroupOpen, setIsGroupOpen] = React.useState(false);

  // Sync groups with localStorage & shared DEFAULT_GROUPS
  const [groups, setGroups] = React.useState<GroupItem[]>(() => getStoredGroups());

  React.useEffect(() => {
    const sync = () => {
      setGroups(getStoredGroups());
    };
    sync();
    window.addEventListener("qurani_groups_updated", sync);
    return () => window.removeEventListener("qurani_groups_updated", sync);
  }, []);

  // Create Group Modal State
  const [isCreateGroupOpen, setIsCreateGroupOpen] = React.useState(false);

  const selectedSurah = selectedSurahId ? SURAT_LIST.find((s) => s.id === selectedSurahId) : null;
  const selectedJuz = selectedJuzId ? JUZ_LIST.find((j) => j.id === selectedJuzId) : null;

  // Find active group and its members
  const activeGroup = groups.find(
    (g) => g.name.toLowerCase() === selectedGroup.toLowerCase()
  );
  const activeMembers =
    activeGroup?.members && activeGroup.members.length > 0
      ? activeGroup.members
      : [
          { id: "mem-1", name: "nanas nanas", username: "@nanas" },
          { id: "mem-2", name: "02_Alvia Agustin", username: "@alvia" },
          { id: "mem-3", name: "fatkul", username: "@fatkul" },
          { id: "mem-4", name: "Ahmad Fauzan", username: "@fauzan" },
        ];

  const handleReset = () => {
    setReciterMode("group");
    setSelectedFriend("");
    setSelectedGroup("");
    setSelectedMember("");
    setRecitationType("tahsin");
    setDisplayMode("surah");
    setSelectedSurahId(null);
    setSelectedJuzId(null);
    setSelectedPageId(null);
    setSelectedPraquranJilid("yanbua-1");
    setSelectedPraquranPage(1);
  };

  const handleStart = () => {
    if (reciterMode === "group") {
      if (!selectedGroup) {
        toast.error("Silakan pilih kelompok terlebih dahulu");
        return;
      }
      if (!selectedMember) {
        toast.error("Silakan pilih anggota kelompok terlebih dahulu");
        return;
      }
    }

    // When in group mode, reciter is the selected member from the group
    const reciterName =
      reciterMode === "group"
        ? selectedMember
        : (selectedFriend.split(" - ")[0] || selectedFriend || "via");

    if (recitationType === "pra-quran") {
      const targetUrl = `/${locale}/recitation/pra-quran?jilid=${selectedPraquranJilid}&page=${selectedPraquranPage}&reciter=${encodeURIComponent(reciterName)}&type=pra-quran`;
      router.push(targetUrl);
      return;
    }

    if (displayMode === "juz") {
      const juzId = selectedJuzId || 1;
      const targetUrl = `/${locale}/recitation/quran/juz/${juzId}?reciter=${encodeURIComponent(reciterName)}&type=${recitationType}`;
      router.push(targetUrl);
      return;
    }

    if (displayMode === "page") {
      const pageId = selectedPageId || 1;
      const targetUrl = `/${locale}/recitation/quran/page/${pageId}?reciter=${encodeURIComponent(reciterName)}&type=${recitationType}`;
      router.push(targetUrl);
      return;
    }

    const surahId = selectedSurahId || 1;
    const targetUrl = `/${locale}/recitation/quran/surah/${surahId}?reciter=${encodeURIComponent(reciterName)}&type=${recitationType}`;
    router.push(targetUrl);
  };

  return (
    <div className="bg-white rounded-2xl p-7 sm:p-8 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full select-none">
      <div className="space-y-5 sm:space-y-6">
        {/* Row 1: Reciter (Friend / Group) */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <span className="w-40 sm:w-44 text-sm font-medium text-gray-800 shrink-0 mb-2 sm:mb-0">
            Reciter
          </span>
          <div className="flex items-center gap-8">
            <RecitationRadioItem
              name="reciter"
              label="Friend"
              checked={reciterMode === "friend"}
              onChange={() => setReciterMode("friend")}
            />
            <RecitationRadioItem
              name="reciter"
              label="Group"
              checked={reciterMode === "group"}
              onChange={() => setReciterMode("group")}
            />
          </div>
        </div>

        {/* Row 2: Friend or Group & Select Member Dropdown Comboboxes */}
        {reciterMode === "friend" ? (
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="w-40 sm:w-44 text-sm font-medium text-gray-800 shrink-0 mb-2 sm:mb-0">
              Friend
            </span>
            <div className="flex-1">
              <Popover open={isFriendOpen} onOpenChange={setIsFriendOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full h-11 flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 shadow-2xs hover:border-gray-300 transition focus:outline-none cursor-pointer"
                  >
                    <span className="text-sm font-normal text-gray-900">
                      {selectedFriend || "Select Friend"}
                    </span>
                    <ChevronsUpDown className="size-4 text-gray-400 shrink-0 ml-2 stroke-[1.5]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 rounded-2xl border border-gray-100 shadow-xl bg-white" align="start">
                  <Command>
                    <CommandInput placeholder="Search friend..." className="text-xs h-9" />
                    <CommandList className="max-h-56 p-1">
                      <CommandEmpty className="py-2 text-center text-xs text-gray-400">
                        No friends found.
                      </CommandEmpty>
                      <CommandGroup>
                        {MOCK_FRIENDS.map((f) => {
                          const label = `${f.name} - ${f.username}`;
                          return (
                            <CommandItem
                              key={f.id}
                              value={label}
                              onSelect={() => {
                                setSelectedFriend(label);
                                setIsFriendOpen(false);
                              }}
                              className="text-xs px-3 py-2 cursor-pointer rounded-lg flex items-center justify-between"
                            >
                              <span>{label}</span>
                              {selectedFriend === label && (
                                <Check className="size-3.5 text-[#00875a]" />
                              )}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ) : (
          <>
            {/* Row 2: Group Dropdown Combobox */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="w-40 sm:w-44 text-sm font-medium text-gray-800 shrink-0 mb-2 sm:mb-0">
                Group
              </span>
              <div className="flex-1">
                <Popover open={isGroupOpen} onOpenChange={setIsGroupOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full h-11 flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 shadow-2xs hover:border-gray-300 transition focus:outline-none cursor-pointer"
                    >
                      <span className="text-sm font-normal text-gray-900">
                        {selectedGroup || "Select Group"}
                      </span>
                      <ChevronsUpDown className="size-4 text-gray-400 shrink-0 ml-2 stroke-[1.5]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0 rounded-2xl border border-gray-100 shadow-xl bg-white" align="start">
                    <Command>
                      <CommandInput placeholder="Search group..." className="text-xs h-9" />
                      <CommandList className="max-h-56 p-1">
                        {groups.length === 0 ? (
                          <div className="py-5 px-3 flex flex-col items-center justify-center gap-3 text-center">
                            <span className="text-xs text-gray-500 font-medium">No groups yet</span>
                            <button
                              type="button"
                              onClick={() => {
                                setIsGroupOpen(false);
                                setIsCreateGroupOpen(true);
                              }}
                              className="w-full py-2.5 px-4 rounded-xl bg-[#00875a] hover:bg-[#00734c] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                            >
                              <Plus className="size-3.5 stroke-[2.5]" />
                              <span>Create Group</span>
                            </button>
                          </div>
                        ) : (
                          <>
                            <CommandEmpty>
                              <div className="py-4 px-3 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
                                <span>No groups found.</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsGroupOpen(false);
                                    setIsCreateGroupOpen(true);
                                  }}
                                  className="w-full py-2 px-3 rounded-xl bg-[#00875a] hover:bg-[#00734c] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                                >
                                  <Plus className="size-3.5 stroke-[2.5]" />
                                  <span>Create Group</span>
                                </button>
                              </div>
                            </CommandEmpty>
                            <CommandGroup>
                              {groups.map((g) => (
                                <CommandItem
                                  key={g.id}
                                  value={g.name}
                                  onSelect={() => {
                                    setSelectedGroup(g.name);
                                    setSelectedMember("");
                                    setIsGroupOpen(false);
                                  }}
                                  className="text-xs px-3 py-2 cursor-pointer rounded-lg flex items-center justify-between"
                                >
                                  <span>{g.name}</span>
                                  {selectedGroup === g.name && (
                                    <Check className="size-3.5 text-[#00875a]" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                            <div className="p-2 border-t border-gray-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsGroupOpen(false);
                                  setIsCreateGroupOpen(true);
                                }}
                                className="w-full py-2 px-3 rounded-xl bg-[#00875a] hover:bg-[#00734c] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                              >
                                <Plus className="size-3.5 stroke-[2.5]" />
                                <span>Create Group</span>
                              </button>
                            </div>
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Row 3: Select Member Dropdown Combobox - ONLY shown when a group is selected! */}
            {selectedGroup && (
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="w-40 sm:w-44 text-sm font-medium text-gray-800 shrink-0 mb-2 sm:mb-0">
                  Select Member
                </span>
                <div className="flex-1">
                  <Popover open={isMemberOpen} onOpenChange={setIsMemberOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full h-11 flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 shadow-2xs hover:border-gray-300 transition focus:outline-none cursor-pointer"
                      >
                        <span className="text-sm font-normal text-gray-900">
                          {selectedMember || "Select Member"}
                        </span>
                        <ChevronsUpDown className="size-4 text-gray-400 shrink-0 ml-2 stroke-[1.5]" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0 rounded-2xl border border-gray-100 shadow-xl bg-white" align="start">
                      <Command>
                        <CommandInput placeholder="Search member..." className="text-xs h-9" />
                        <CommandList className="max-h-56 p-1">
                          <CommandEmpty className="py-2 text-center text-xs text-gray-400">
                            No member found.
                          </CommandEmpty>
                          <CommandGroup>
                            {activeMembers.map((m) => (
                              <CommandItem
                                key={m.id}
                                value={m.name}
                                onSelect={() => {
                                  setSelectedMember(m.name);
                                  setIsMemberOpen(false);
                                }}
                                className="text-xs px-3 py-2 cursor-pointer rounded-lg flex items-center justify-between"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-900">{m.name}</span>
                                  <span className="text-[11px] text-gray-400">{m.username}</span>
                                </div>
                                {selectedMember === m.name && (
                                  <Check className="size-3.5 text-[#00875a]" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </>
        )}

        {/* Row 3: Recitation Type (Tahsin / Tahfidz / Pra Quran) */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <span className="w-40 sm:w-44 text-sm font-medium text-gray-800 shrink-0 mb-2 sm:mb-0">
            Recitation Type
          </span>
          <div className="flex items-center gap-6 sm:gap-8">
            <RecitationRadioItem
              name="type"
              label="Tahsin"
              checked={recitationType === "tahsin"}
              onChange={() => setRecitationType("tahsin")}
            />
            <RecitationRadioItem
              name="type"
              label="Tahfidz"
              checked={recitationType === "tahfidz"}
              onChange={() => setRecitationType("tahfidz")}
            />
            <RecitationRadioItem
              name="type"
              label="Pra Quran"
              checked={recitationType === "pra-quran"}
              onChange={() => setRecitationType("pra-quran")}
            />
          </div>
        </div>

        {/* Row 4: Display Mode or Pra Quran Method */}
        {recitationType === "pra-quran" ? (
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="w-40 sm:w-44 text-sm font-medium text-gray-800 shrink-0 mb-2 sm:mb-0">
              Metode
            </span>
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-[#00875a] border border-emerald-200 text-xs font-semibold">
                Yanbu&apos;a (Thoriqoh Baca Tulis Al-Qur&apos;an)
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="w-40 sm:w-44 text-sm font-medium text-gray-800 shrink-0 mb-2 sm:mb-0">
              Display
            </span>
            <div className="flex items-center gap-6 sm:gap-8">
              <RecitationRadioItem
                name="display"
                label="Surah"
                checked={displayMode === "surah"}
                onChange={() => setDisplayMode("surah")}
              />
              <RecitationRadioItem
                name="display"
                label="Juz"
                checked={displayMode === "juz"}
                onChange={() => setDisplayMode("juz")}
              />
              <RecitationRadioItem
                name="display"
                label="Page"
                checked={displayMode === "page"}
                onChange={() => setDisplayMode("page")}
              />
            </div>
          </div>
        )}

        {/* Row 5: Selection Controls + Pills right underneath */}
        {recitationType === "pra-quran" ? (
          <div className="flex flex-col sm:flex-row sm:items-start">
            <span className="w-40 sm:w-44 text-sm font-medium text-gray-800 shrink-0 mb-2 sm:mb-0 pt-2.5">
              Jilid &amp; Halaman
            </span>
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Jilid Combobox */}
                <Popover open={isPraquranJilidOpen} onOpenChange={setIsPraquranJilidOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full h-11 flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 shadow-2xs hover:border-gray-300 transition focus:outline-none cursor-pointer"
                    >
                      <span className="text-sm font-normal text-gray-900">
                        {selectedPraquranJilid === "yanbua-1"
                          ? "Yanbua Jilid 1"
                          : "Yanbua Jilid 2"}
                      </span>
                      <ChevronsUpDown className="size-4 text-gray-400 shrink-0 ml-2 stroke-[1.5]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[240px] p-0 rounded-2xl border border-gray-100 shadow-xl bg-white" align="start">
                    <Command>
                      <CommandList className="p-1">
                        <CommandGroup>
                          {PRAQURAN_LIST.map((j) => (
                            <CommandItem
                              key={j.id}
                              value={j.name}
                              onSelect={() => {
                                setSelectedPraquranJilid(j.id);
                                setSelectedPraquranPage(1);
                                setIsPraquranJilidOpen(false);
                              }}
                              className="text-xs px-3 py-2 cursor-pointer rounded-lg flex items-center justify-between"
                            >
                              <span>{j.name}</span>
                              {selectedPraquranJilid === j.id && (
                                <Check className="size-3.5 text-[#00875a]" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Halaman Combobox */}
                <Popover open={isPraquranPageOpen} onOpenChange={setIsPraquranPageOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full h-11 flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 shadow-2xs hover:border-gray-300 transition focus:outline-none cursor-pointer"
                    >
                      <span className="text-sm font-normal text-gray-900">Halaman {selectedPraquranPage}</span>
                      <ChevronsUpDown className="size-4 text-gray-400 shrink-0 ml-2 stroke-[1.5]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[220px] p-0 rounded-2xl border border-gray-100 shadow-xl bg-white" align="start">
                    <Command>
                      <CommandInput placeholder="Cari Halaman" className="text-xs h-9" />
                      <CommandList className="max-h-56 p-1 overflow-y-auto">
                        <CommandGroup>
                          {Array.from(
                            { length: selectedPraquranJilid === "yanbua-1" ? 48 : 43 },
                            (_, i) => i + 1
                          ).map((pageNum) => (
                            <CommandItem
                              key={pageNum}
                              value={`Halaman ${pageNum}`}
                              onSelect={() => {
                                setSelectedPraquranPage(pageNum);
                                setIsPraquranPageOpen(false);
                              }}
                              className="text-xs px-3 py-2 cursor-pointer rounded-lg flex items-center justify-between"
                            >
                              <span>Halaman {pageNum}</span>
                              {selectedPraquranPage === pageNum && (
                                <Check className="size-3.5 text-[#00875a]" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Quick Pra Quran Pills */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {quickYanbua.map((item) => {
                  const isSelected =
                    selectedPraquranJilid === item.jilid &&
                    selectedPraquranPage === item.page;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setSelectedPraquranJilid(item.jilid);
                        setSelectedPraquranPage(item.page);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                        isSelected
                          ? "bg-[#00875a] text-white font-medium shadow-xs"
                          : "bg-[#e2e8f0]/60 hover:bg-[#e2e8f0] text-gray-800"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-start">
            <span className="w-40 sm:w-44 text-sm font-medium text-gray-800 shrink-0 mb-2 sm:mb-0 pt-2.5">
              {displayMode === "surah" ? "Surah" : displayMode === "juz" ? "Juz" : "Page"}
            </span>
            <div className="flex-1 space-y-3">
              {displayMode === "surah" && (
                <>
                  <Popover open={isSurahOpen} onOpenChange={setIsSurahOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full h-11 flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 shadow-2xs hover:border-gray-300 transition focus:outline-none cursor-pointer"
                      >
                        <span className="text-sm font-normal text-gray-900">
                          {selectedSurah ? selectedSurah.name : "Select Surah"}
                        </span>
                        <ChevronsUpDown className="size-4 text-gray-400 shrink-0 ml-2 stroke-[1.5]" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0 rounded-2xl border border-gray-100 shadow-xl bg-white" align="start">
                      <Command>
                        <CommandInput placeholder="Search Surah (1-114)" className="text-xs h-9" />
                        <CommandList className="max-h-60 p-1 overflow-y-auto">
                          <CommandEmpty className="py-2 text-center text-xs text-gray-400">
                            Surah tidak ditemukan.
                          </CommandEmpty>
                          <CommandGroup>
                            {SURAT_LIST.map((surah) => (
                              <CommandItem
                                key={surah.id}
                                value={surah.name}
                                onSelect={() => {
                                  setSelectedSurahId(surah.id);
                                  setIsSurahOpen(false);
                                }}
                                className="text-xs px-3 py-2 cursor-pointer rounded-lg flex items-center justify-between"
                              >
                                <span>{surah.name}</span>
                                {selectedSurahId === surah.id && (
                                  <Check className="size-3.5 text-[#00875a]" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Quick Surahs Pills (Al-Fatihah, Yasin, Al-Waqi'ah, Al-Mulk) */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    {quickSurahs.map((name) => {
                      const surahObj = SURAT_LIST.find((s) => s.name.toLowerCase().startsWith(name.toLowerCase()));
                      const isSelected = surahObj?.id === selectedSurahId;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            if (surahObj) setSelectedSurahId(surahObj.id);
                          }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                            isSelected
                              ? "bg-[#00875a] text-white font-medium shadow-xs"
                              : "bg-[#e2e8f0]/60 hover:bg-[#e2e8f0] text-gray-800"
                          }`}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {displayMode === "juz" && (
                <>
                  <Popover open={isJuzOpen} onOpenChange={setIsJuzOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full h-11 flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 shadow-2xs hover:border-gray-300 transition focus:outline-none cursor-pointer"
                      >
                        <span className="text-sm font-normal text-gray-900">
                          {selectedJuz ? selectedJuz.name : "Select Juz"}
                        </span>
                        <ChevronsUpDown className="size-4 text-gray-400 shrink-0 ml-2 stroke-[1.5]" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0 rounded-2xl border border-gray-100 shadow-xl bg-white" align="start">
                      <Command>
                        <CommandInput placeholder="Search Juz (1-30)" className="text-xs h-9" />
                        <CommandList className="max-h-60 p-1 overflow-y-auto">
                          <CommandEmpty className="py-2 text-center text-xs text-gray-400">
                            Juz tidak ditemukan.
                          </CommandEmpty>
                          <CommandGroup>
                            {JUZ_LIST.map((juz) => (
                              <CommandItem
                                key={juz.id}
                                value={juz.name}
                                onSelect={() => {
                                  setSelectedJuzId(juz.id);
                                  setIsJuzOpen(false);
                                }}
                                className="text-xs px-3 py-2 cursor-pointer rounded-lg flex items-center justify-between"
                              >
                                <span>{juz.name} ({juz.startSurat} - {juz.endSurat})</span>
                                {selectedJuzId === juz.id && (
                                  <Check className="size-3.5 text-[#00875a]" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Quick Juz Pills */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    {quickJuz.map((jId) => {
                      const isSelected = selectedJuzId === jId;
                      return (
                        <button
                          key={`juz-${jId}`}
                          type="button"
                          onClick={() => setSelectedJuzId(jId)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                            isSelected
                              ? "bg-[#00875a] text-white font-medium shadow-xs"
                              : "bg-[#e2e8f0]/60 hover:bg-[#e2e8f0] text-gray-800"
                          }`}
                        >
                          Juz {jId}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {displayMode === "page" && (
                <>
                  <Popover open={isPageOpen} onOpenChange={setIsPageOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full h-11 flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 shadow-2xs hover:border-gray-300 transition focus:outline-none cursor-pointer"
                      >
                        <span className="text-sm font-normal text-gray-900">
                          {selectedPageId ? `Page ${selectedPageId}` : "Select Page"}
                        </span>
                        <ChevronsUpDown className="size-4 text-gray-400 shrink-0 ml-2 stroke-[1.5]" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0 rounded-2xl border border-gray-100 shadow-xl bg-white" align="start">
                      <Command>
                        <CommandInput placeholder="Search Page (1-604)" className="text-xs h-9" />
                        <CommandList className="max-h-60 p-1 overflow-y-auto">
                          <CommandGroup>
                            {HALAMAN_LIST.map((pg) => (
                              <CommandItem
                                key={pg.id}
                                value={`Page ${pg.id}`}
                                onSelect={() => {
                                  setSelectedPageId(pg.id);
                                  setIsPageOpen(false);
                                }}
                                className="text-xs px-3 py-2 cursor-pointer rounded-lg flex items-center justify-between"
                              >
                                <span>Page {pg.id} (Juz {pg.juz})</span>
                                {selectedPageId === pg.id && (
                                  <Check className="size-3.5 text-[#00875a]" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Quick Page Pills */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    {quickPages.map((pgId) => {
                      const isSelected = selectedPageId === pgId;
                      return (
                        <button
                          key={`page-${pgId}`}
                          type="button"
                          onClick={() => setSelectedPageId(pgId)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                            isSelected
                              ? "bg-[#00875a] text-white font-medium shadow-xs"
                              : "bg-[#e2e8f0]/60 hover:bg-[#e2e8f0] text-gray-800"
                          }`}
                        >
                          Page {pgId}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Row 6: Action Buttons (Reset, Start) */}
      <div className="flex items-center justify-end gap-3 pt-6">
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 shadow-2xs transition cursor-pointer"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleStart}
          className="px-7 py-2.5 rounded-xl bg-[#00875a] hover:bg-[#00734c] text-white text-sm font-semibold shadow-xs transition cursor-pointer"
        >
          Start
        </button>
      </div>

      {/* Create New Group Modal matching live site 1:1 */}
      <CreateGroupModal
        open={isCreateGroupOpen}
        onOpenChange={setIsCreateGroupOpen}
        onGroupCreated={(newGrp) => {
          setSelectedGroup(newGrp.name);
          setSelectedMember("");
          const newItem: GroupItem = {
            id: newGrp.id,
            name: newGrp.name,
            location: `${(newGrp as any).city || "Malang"} - ${(newGrp as any).province || "Jawa Timur"}`,
            avatarLetters: newGrp.name.slice(0, 2).toUpperCase(),
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
          setGroups((prev) => [newItem, ...prev]);
        }}
      />
    </div>
  );
}
