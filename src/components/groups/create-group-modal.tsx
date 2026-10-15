"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { X, ChevronDown, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreated?: (group: { id: string; name: string; category: string; description: string }) => void;
}

const CATEGORIES = [
  "Kampus",
  "Kantor",
  "Keluarga",
  "Komunitas",
  "Lainnya",
  "Masjid/Musholla",
  "Pesantren",
  "Sekolah",
  "TPA/TPQ",
  "Umum",
];

export function CreateGroupModal({
  open,
  onOpenChange,
  onGroupCreated,
}: CreateGroupModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.startsWith("/id") ? "id" : "en";

  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
  const [country, setCountry] = React.useState("Indonesia");
  const [province, setProvince] = React.useState("Jawa Timur");
  const [city, setCity] = React.useState("Malang");
  const [type, setType] = React.useState<"public" | "private" | "secret">("public");
  const [description, setDescription] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const categoryRef = React.useRef<HTMLDivElement>(null);
  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const dialogContentRef = React.useRef<HTMLDivElement>(null);

  // Close category dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    if (isCategoryOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isCategoryOpen]);

  const resetForm = () => {
    setName("");
    setCategory("");
    setIsCategoryOpen(false);
    setCountry("Indonesia");
    setProvince("Jawa Timur");
    setCity("Malang");
    setType("public");
    setDescription("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a group name");
      if (dialogContentRef.current) {
        dialogContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 200);
      return;
    }

    setIsSubmitting(true);

    const newGroup = {
      id: `group-${Date.now()}`,
      name: name.trim(),
      category: category || "Umum",
      country: country.trim() || "Indonesia",
      province: province.trim() || "Jawa Timur",
      city: city.trim() || "Malang",
      type,
      description: description.trim(),
      membersCount: 1,
      isPrivate: type !== "public",
      joined: true,
      avatarColor: "bg-emerald-600 text-white",
    };

    // Save to localStorage
    try {
      const existingStr = localStorage.getItem("qurani_user_groups");
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const updated = [newGroup, ...existing];
      localStorage.setItem("qurani_user_groups", JSON.stringify(updated));
      window.dispatchEvent(new Event("qurani_groups_updated"));
    } catch {}

    toast.success(`Group "${newGroup.name}" created successfully!`);
    resetForm();
    setIsSubmitting(false);
    onOpenChange(false);

    if (onGroupCreated) {
      onGroupCreated(newGroup);
    } else {
      // Redirect directly to the groups page when creating from groups page
      router.push(`/${locale}/groups`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={dialogContentRef}
        className="sm:max-w-[490px] w-[95vw] max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-2xl [&>button]:hidden"
      >
        {/* Header with Title & Close 'X' */}
        <div className="flex items-center justify-between pb-2">
          <DialogTitle className="text-lg font-bold text-gray-900 tracking-tight">
            Create New Group
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* 1. Group Name */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-gray-800 block">
              Group Name
            </label>
            <input
              ref={nameInputRef}
              type="text"
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Group name..."
              className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
              autoFocus
            />
            <div className="flex justify-end">
              <span className="text-[11px] text-gray-400">
                {name.length}/50 characters
              </span>
            </div>
          </div>

          {/* 2. Category */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-gray-800 block">
              Category
            </label>
            <div ref={categoryRef} className="relative">
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-xs sm:text-sm flex items-center justify-between bg-white text-left focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition cursor-pointer"
              >
                <span className={category ? "text-gray-900 font-medium" : "text-gray-400"}>
                  {category || "Select Category..."}
                </span>
                <ChevronDown
                  className={`size-4 text-gray-400 transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Category Dropdown Menu matching screenshot 1:1 */}
              {isCategoryOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-gray-200/90 rounded-2xl shadow-xl p-1.5 max-h-64 overflow-y-auto space-y-0.5 animate-in fade-in-50 zoom-in-95 duration-150">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <div
                        key={cat}
                        onClick={() => {
                          setCategory(cat);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl cursor-pointer transition select-none flex items-center justify-between ${
                          isSelected
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected && <Check className="size-3.5 text-emerald-600" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 3. Country */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-gray-800 block">
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-xs sm:text-sm text-gray-800 text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          {/* 4. Province */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-gray-800 block">
              Province
            </label>
            <input
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-xs sm:text-sm text-gray-800 text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          {/* 5. City */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-gray-800 block">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-xs sm:text-sm text-gray-800 text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          {/* 6. Type Radio Group */}
          <div className="space-y-2 pt-1">
            <label className="text-xs sm:text-sm font-semibold text-gray-800 block">
              Type
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-800 font-medium cursor-pointer select-none">
                <input
                  type="radio"
                  name="groupType"
                  value="public"
                  checked={type === "public"}
                  onChange={() => setType("public")}
                  className="size-3.5 accent-[#00875a] cursor-pointer"
                />
                <span>Public</span>
              </label>

              <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-800 font-medium cursor-pointer select-none">
                <input
                  type="radio"
                  name="groupType"
                  value="private"
                  checked={type === "private"}
                  onChange={() => setType("private")}
                  className="size-3.5 accent-[#00875a] cursor-pointer"
                />
                <span>Private</span>
              </label>

              <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-800 font-medium cursor-pointer select-none">
                <input
                  type="radio"
                  name="groupType"
                  value="secret"
                  checked={type === "secret"}
                  onChange={() => setType("secret")}
                  className="size-3.5 accent-[#00875a] cursor-pointer"
                />
                <span>Secret</span>
              </label>
            </div>
          </div>

          {/* 7. Description (Optional) */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs sm:text-sm font-semibold text-gray-800 block">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Group description..."
              className="w-full p-3 rounded-xl border border-gray-300 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-y transition"
            />
            <div className="flex justify-end">
              <span className="text-[11px] text-gray-400">
                {description.length}/500 characters
              </span>
            </div>
          </div>

          {/* 8. Profile Photo (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-gray-800 block">
              Profile Photo (Optional)
            </label>
            <div className="w-full h-11 px-3 rounded-xl border border-gray-300 flex items-center bg-white">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  } else {
                    setSelectedFile(null);
                  }
                }}
                className="w-full text-xs sm:text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border file:border-gray-300 file:text-xs file:font-medium file:bg-white hover:file:bg-gray-50 file:text-gray-700 cursor-pointer"
              />
            </div>
          </div>

          {/* 9. Footer Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-5 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-700 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 shadow-xs ${
                name.trim().length > 0
                  ? "bg-[#00875a] hover:bg-[#00754e] text-white cursor-pointer shadow-sm"
                  : "bg-[#57b7a2] text-white/80 opacity-60 cursor-pointer"
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
