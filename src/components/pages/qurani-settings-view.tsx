"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Check,
  Minus,
  Plus,
  Pencil,
  Trash2,
  PlusCircle,
} from "lucide-react";
import {
  useQuraniSettings,
  saveStoredQuraniSettings,
  VerseErrorCategory,
  QuraniSettings,
  DEFAULT_QURANI_SETTINGS,
} from "@/hooks/use-qurani-settings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const FONT_SIZE_MAP: Record<number, { size: string; leading: string }> = {
  1: { size: "18px", leading: "2.2" },
  2: { size: "22px", leading: "2.2" },
  3: { size: "26px", leading: "2.2" },
  4: { size: "30px", leading: "2.3" },
  5: { size: "34px", leading: "2.3" },
  6: { size: "38px", leading: "2.4" },
  7: { size: "43px", leading: "2.5" },
  8: { size: "48px", leading: "2.5" },
  9: { size: "53px", leading: "2.6" },
  10: { size: "60px", leading: "2.7" },
};

const COLOR_PRESETS = [
  { bg: "#93c5fd", text: "#0f172a", name: "Blue" },
  { bg: "#bef264", text: "#0f172a", name: "Lime" },
  { bg: "#fca5a5", text: "#0f172a", name: "Pink/Red" },
  { bg: "#fb923c", text: "#0f172a", name: "Orange" },
  { bg: "#991b1b", text: "#ffffff", name: "Dark Red" },
  { bg: "#e2e8f0", text: "#0f172a", name: "Gray" },
  { bg: "#fde047", text: "#0f172a", name: "Yellow" },
  { bg: "#99f6e4", text: "#0f172a", name: "Teal" },
  { bg: "#e9d5ff", text: "#0f172a", name: "Purple" },
  { bg: "#a7f3d0", text: "#0f172a", name: "Emerald" },
];

export function QuraniSettingsView() {
  const router = useRouter();
  const { settings, isLoaded } = useQuraniSettings();

  // Local draft state to stage changes until user clicks "Save"
  const [draft, setDraft] = React.useState<QuraniSettings>(settings);

  // Sync draft whenever loaded settings update
  React.useEffect(() => {
    if (isLoaded) {
      setDraft(settings);
    }
  }, [isLoaded, settings]);

  // Determine if draft has changes compared to saved settings
  const hasChanges = React.useMemo(() => {
    if (!isLoaded) return false;
    return JSON.stringify(draft) !== JSON.stringify(settings);
  }, [isLoaded, draft, settings]);

  const [isFontDropdownOpen, setIsFontDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Edit modal state
  const [editingType, setEditingType] = React.useState<"verse" | "word">("verse");
  const [editingCategory, setEditingCategory] = React.useState<VerseErrorCategory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newCatLabel, setNewCatLabel] = React.useState("");
  const [newCatBg, setNewCatBg] = React.useState("#93c5fd");
  const [newCatText, setNewCatText] = React.useState("#0f172a");

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFontDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDecreaseFontSize = () => {
    if (draft.fontSize > 1) {
      setDraft((prev) => ({ ...prev, fontSize: prev.fontSize - 1 }));
    }
  };

  const handleIncreaseFontSize = () => {
    if (draft.fontSize < 10) {
      setDraft((prev) => ({ ...prev, fontSize: prev.fontSize + 1 }));
    }
  };

  const handleToggleVerseError = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      verseErrors: prev.verseErrors.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      ),
    }));
  };

  const handleToggleWordError = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      wordErrors: prev.wordErrors.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      ),
    }));
  };

  const handleOpenEdit = (cat: VerseErrorCategory, type: "verse" | "word" = "verse") => {
    setEditingCategory({ ...cat });
    setEditingType(type);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingCategory) return;
    if (!editingCategory.label.trim()) {
      toast.error("Nama kategori tidak boleh kosong");
      return;
    }
    if (editingType === "verse") {
      setDraft((prev) => ({
        ...prev,
        verseErrors: prev.verseErrors.map((item) =>
          item.id === editingCategory.id
            ? { ...item, label: editingCategory.label.trim(), bg: editingCategory.bg, text: editingCategory.text }
            : item
        ),
      }));
    } else {
      setDraft((prev) => ({
        ...prev,
        wordErrors: prev.wordErrors.map((item) =>
          item.id === editingCategory.id
            ? { ...item, label: editingCategory.label.trim(), bg: editingCategory.bg, text: editingCategory.text }
            : item
        ),
      }));
    }
    setIsEditModalOpen(false);
    toast.success("Kategori berhasil diperbarui");
  };

  const handleDeleteEdit = () => {
    if (!editingCategory) return;
    if (editingType === "verse") {
      setDraft((prev) => ({
        ...prev,
        verseErrors: prev.verseErrors.filter((item) => item.id !== editingCategory.id),
      }));
    } else {
      setDraft((prev) => ({
        ...prev,
        wordErrors: prev.wordErrors.filter((item) => item.id !== editingCategory.id),
      }));
    }
    setIsEditModalOpen(false);
    toast.success("Kategori berhasil dihapus");
  };

  const handleSaveNew = () => {
    if (!newCatLabel.trim()) {
      toast.error("Nama kategori tidak boleh kosong");
      return;
    }
    const newCategory: VerseErrorCategory = {
      id: `cat_${Date.now()}`,
      label: newCatLabel.trim(),
      bg: newCatBg,
      text: newCatText,
      enabled: true,
    };
    setDraft((prev) => ({
      ...prev,
      verseErrors: [...prev.verseErrors, newCategory],
    }));
    setNewCatLabel("");
    setIsAddModalOpen(false);
    toast.success("Kategori baru berhasil ditambahkan");
  };

  const handleReset = () => {
    setDraft(settings);
    toast.info("Perubahan dibatalkan");
  };

  const handleSave = () => {
    saveStoredQuraniSettings(draft);
    toast.success("Pengaturan Qurani berhasil disimpan");
  };

  const currentFontStyle = FONT_SIZE_MAP[draft.fontSize] || FONT_SIZE_MAP[3];

  if (!isLoaded) {
    return (
      <div className="w-full px-6 sm:px-10 py-8">
        <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse mb-6" />
        <div className="h-96 w-full bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full px-6 sm:px-10 py-6 sm:py-8 space-y-6 font-sans">
      {/* 1. Header with back button matching original web */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          type="button"
          className="flex items-center gap-2.5 text-gray-900 hover:text-black transition cursor-pointer group"
        >
          <ArrowLeft className="size-5 stroke-[2.5] text-gray-900 group-hover:-translate-x-0.5 transition-transform" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            Qurani Settings
          </h1>
        </button>
      </div>

      {/* 2. Main White Container Card matching screenshots */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 sm:p-8 space-y-7 w-full">
        {/* SECTION 1: LAYOUT */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-800 tracking-wider uppercase block">
            LAYOUT
          </label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-800 select-none">
              <input
                type="radio"
                name="layout"
                checked={draft.layout === "flexible"}
                onChange={() => setDraft((prev) => ({ ...prev, layout: "flexible" }))}
                className="size-4 accent-[#2563eb] cursor-pointer"
              />
              <span>Flexible</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-800 select-none">
              <input
                type="radio"
                name="layout"
                checked={draft.layout === "mushaf_uthmani"}
                onChange={() => setDraft((prev) => ({ ...prev, layout: "mushaf_uthmani" }))}
                className="size-4 accent-[#2563eb] cursor-pointer"
              />
              <span>Mushaf Uthmani</span>
            </label>
          </div>
        </div>

        {/* SECTION 2: FONT TYPE */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-gray-800 tracking-wider uppercase block">
            FONT TYPE
          </label>
          <div className="relative max-w-xs" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsFontDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 shadow-2xs hover:border-gray-300 transition cursor-pointer"
            >
              <span>{draft.fontType === "utsmani" ? "Utsmani" : "IndoPak"}</span>
              <ChevronDown
                className={`size-4 text-gray-400 transition-transform duration-200 ${
                  isFontDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Options Popup matching Screenshot 2 */}
            {isFontDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-1 z-30 space-y-0.5 animate-in fade-in-50 zoom-in-95">
                <button
                  type="button"
                  onClick={() => {
                    setDraft((prev) => ({ ...prev, fontType: "indopak" }));
                    setIsFontDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-800 hover:bg-gray-50 rounded-lg transition cursor-pointer text-left"
                >
                  <span>IndoPak</span>
                  {draft.fontType === "indopak" && (
                    <Check className="size-4 text-gray-700 stroke-[2.5]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft((prev) => ({ ...prev, fontType: "utsmani" }));
                    setIsFontDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-800 hover:bg-gray-50 rounded-lg transition cursor-pointer text-left"
                >
                  <span>Utsmani</span>
                  {draft.fontType === "utsmani" && (
                    <Check className="size-4 text-gray-700 stroke-[2.5]" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: FONT SIZE */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-gray-800 tracking-wider uppercase block">
            FONT SIZE
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDecreaseFontSize}
              disabled={draft.fontSize <= 1}
              className="size-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <Minus className="size-3.5 stroke-[2.5]" />
            </button>

            <div className="h-8 min-w-12 px-3 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-xs font-bold text-gray-900 select-none shadow-2xs">
              {draft.fontSize}
            </div>

            <button
              type="button"
              onClick={handleIncreaseFontSize}
              disabled={draft.fontSize >= 10}
              className="size-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <Plus className="size-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* SECTION 4: LIVE PREVIEW BOX */}
        <div className="w-full rounded-2xl border border-gray-200 bg-white py-10 px-8 flex items-center justify-center min-h-[140px] select-none shadow-2xs transition-all overflow-hidden">
          <p
            dir="rtl"
            style={{
              fontSize: currentFontStyle.size,
              lineHeight: currentFontStyle.leading,
            }}
            className={`text-gray-900 text-center tracking-normal ${
              draft.fontType === "utsmani" ? "font-utsmani" : "font-indopak"
            }`}
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
        </div>

        {/* SECTION 5: PAGE SUMMARY */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-800 tracking-wider uppercase block">
            PAGE SUMMARY
          </label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-800 select-none">
              <input
                type="radio"
                name="pageSummary"
                checked={draft.pageSummary === "show"}
                onChange={() => setDraft((prev) => ({ ...prev, pageSummary: "show" }))}
                className="size-4 accent-[#2563eb] cursor-pointer"
              />
              <span>Show</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-800 select-none">
              <input
                type="radio"
                name="pageSummary"
                checked={draft.pageSummary === "hide"}
                onChange={() => setDraft((prev) => ({ ...prev, pageSummary: "hide" }))}
                className="size-4 accent-[#2563eb] cursor-pointer"
              />
              <span>Hide</span>
            </label>
          </div>
        </div>

        {/* SECTION 6: VERSE ERRORS */}
        <div className="space-y-3.5">
          <label className="text-xs font-bold text-gray-800 tracking-wider uppercase block">
            VERSE ERRORS
          </label>

          {/* 2-Column Grid matching Screenshot 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {draft.verseErrors.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2.5">
                {/* Circular Blue Checkbox */}
                <button
                  type="button"
                  onClick={() => handleToggleVerseError(cat.id)}
                  className={`size-4.5 rounded-full flex items-center justify-center shrink-0 transition cursor-pointer ${
                    cat.enabled
                      ? "bg-[#2563eb] text-white"
                      : "border border-gray-300 bg-white"
                  }`}
                  title={cat.enabled ? "Kategori Aktif" : "Kategori Nonaktif"}
                >
                  {cat.enabled && <Check className="size-3 stroke-[3]" />}
                </button>

                {/* Badge Container */}
                <div
                  style={{
                    backgroundColor: cat.bg,
                    color: cat.text,
                  }}
                  className={`flex-1 flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold shadow-2xs transition-opacity ${
                    cat.enabled ? "opacity-100" : "opacity-40 grayscale"
                  }`}
                >
                  <span className="truncate">{cat.label}</span>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat, "verse")}
                    className="p-1 hover:opacity-75 transition cursor-pointer shrink-0 ml-2"
                    title="Edit kategori ini"
                  >
                    <Pencil className="size-3.5 stroke-[2.2]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 7: WORD ERRORS matching screenshot */}
        <div className="space-y-3.5 pt-2">
          <label className="text-xs font-bold text-gray-800 tracking-wider uppercase block">
            WORD ERRORS
          </label>

          {/* 2-Column Grid matching Screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {draft.wordErrors.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2.5">
                {/* Circular Blue Checkbox */}
                <button
                  type="button"
                  onClick={() => handleToggleWordError(cat.id)}
                  className={`size-4.5 rounded-full flex items-center justify-center shrink-0 transition cursor-pointer ${
                    cat.enabled
                      ? "bg-[#2563eb] text-white"
                      : "border border-gray-300 bg-white"
                  }`}
                  title={cat.enabled ? "Kategori Aktif" : "Kategori Nonaktif"}
                >
                  {cat.enabled && <Check className="size-3 stroke-[3]" />}
                </button>

                {/* Badge Container */}
                <div
                  style={{
                    backgroundColor: cat.bg,
                    color: cat.text,
                  }}
                  className={`flex-1 flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold shadow-2xs transition-opacity ${
                    cat.enabled ? "opacity-100" : "opacity-40 grayscale"
                  }`}
                >
                  <span className="truncate">{cat.label}</span>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat, "word")}
                    className="p-1 hover:opacity-75 transition cursor-pointer shrink-0 ml-2"
                    title="Edit kategori ini"
                  >
                    <Pencil className="size-3.5 stroke-[2.2]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BUTTONS: Reset & Save (Right-aligned matching screenshot) */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasChanges}
          className={`px-7 py-2.5 rounded-xl border text-xs font-semibold transition shadow-2xs ${
            hasChanges
              ? "bg-white hover:bg-gray-50 border-gray-200 text-gray-800 cursor-pointer"
              : "bg-gray-50 border-gray-200/60 text-gray-400 cursor-not-allowed opacity-60"
          }`}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges}
          className={`px-7 py-2.5 rounded-xl text-xs font-bold transition shadow-2xs ${
            hasChanges
              ? "bg-[#00875a] hover:bg-[#00734c] text-white cursor-pointer shadow-sm active:scale-95"
              : "bg-[#00875a]/30 text-white/70 cursor-not-allowed opacity-60"
          }`}
        >
          Save
        </button>
      </div>

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 border border-gray-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900 text-left">
              Edit Kategori Kesalahan {editingType === "verse" ? "Ayat" : "Kata"}
            </DialogTitle>
          </DialogHeader>

          {editingCategory && (
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">Nama Kategori</Label>
                <Input
                  value={editingCategory.label}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, label: e.target.value })
                  }
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-700">Pilih Warna Badge</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.bg}
                      type="button"
                      onClick={() =>
                        setEditingCategory({
                          ...editingCategory,
                          bg: preset.bg,
                          text: preset.text,
                        })
                      }
                      style={{ backgroundColor: preset.bg }}
                      className={`size-7 rounded-full border-2 transition cursor-pointer flex items-center justify-center ${
                        editingCategory.bg === preset.bg
                          ? "border-black scale-110 shadow-xs"
                          : "border-transparent"
                      }`}
                      title={preset.name}
                    >
                      {editingCategory.bg === preset.bg && (
                        <Check
                          className="size-3.5 stroke-[3]"
                          style={{ color: preset.text }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-semibold text-gray-500">Preview Tampilan</Label>
                <div
                  style={{
                    backgroundColor: editingCategory.bg,
                    color: editingCategory.text,
                  }}
                  className="flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold"
                >
                  <span>{editingCategory.label || "Nama Kategori"}</span>
                  <Pencil className="size-3.5" />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:justify-between items-center gap-2 pt-4 border-t border-gray-100 mt-2">
            {editingCategory && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleDeleteEdit}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-medium cursor-pointer"
              >
                <Trash2 className="size-3.5 mr-1" />
                Hapus
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleSaveEdit}
                className="rounded-xl bg-[#00875a] hover:bg-[#00754e] text-white text-xs font-semibold cursor-pointer"
              >
                Terapkan
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
