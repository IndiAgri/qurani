"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings2,
  Globe,
  Users2,
  UserCheck,
  ShieldCheck,
  Save,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchRecitationSettings,
  saveRecitationSetting,
  RecitationSettingConfig,
  DEFAULT_GLOBAL_SETTINGS,
} from "@/lib/supabase-recitation";
import { MOCK_GROUPS, MOCK_FRIENDS } from "@/data/mock-setoran-data";

interface RecitationSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecitationSettingsDialog({
  open,
  onOpenChange,
}: RecitationSettingsDialogProps) {
  const [activeTab, setActiveTab] = React.useState<"global" | "group" | "user">("global");
  const [allSettings, setAllSettings] = React.useState<RecitationSettingConfig[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  // Global settings state
  const [globalConfig, setGlobalConfig] = React.useState<RecitationSettingConfig>(
    DEFAULT_GLOBAL_SETTINGS
  );

  // Group settings state
  const [selectedGroupId, setSelectedGroupId] = React.useState<string>(MOCK_GROUPS[0].id);
  const [groupConfig, setGroupConfig] = React.useState<RecitationSettingConfig>({
    type: "group",
    target_id: MOCK_GROUPS[0].id,
    target_name: MOCK_GROUPS[0].name,
    passing_grade: 85,
    max_tajweed_mistakes: 2,
    max_makhraj_mistakes: 1,
    max_harakat_mistakes: 2,
    strictness: "strict",
    auto_notify_parent: true,
    auto_notify_admin: true,
    auto_notify_teacher: true,
    mushaf_display_format: "madinah",
  });

  // User settings state
  const [selectedUserId, setSelectedUserId] = React.useState<string>(MOCK_FRIENDS[0].username);
  const [userConfig, setUserConfig] = React.useState<RecitationSettingConfig>({
    type: "user",
    target_id: MOCK_FRIENDS[0].username,
    target_name: MOCK_FRIENDS[0].name,
    passing_grade: 80,
    max_tajweed_mistakes: 3,
    max_makhraj_mistakes: 2,
    max_harakat_mistakes: 3,
    strictness: "medium",
    auto_notify_parent: true,
    auto_notify_admin: false,
    auto_notify_teacher: true,
    mushaf_display_format: "madinah",
  });

  // Load existing settings
  React.useEffect(() => {
    if (open) {
      fetchRecitationSettings().then((list) => {
        setAllSettings(list);
        const globalFound = list.find((s) => s.type === "global");
        if (globalFound) setGlobalConfig(globalFound);

        const groupFound = list.find(
          (s) => s.type === "group" && s.target_id === selectedGroupId
        );
        if (groupFound) setGroupConfig(groupFound);

        const userFound = list.find(
          (s) => s.type === "user" && s.target_id === selectedUserId
        );
        if (userFound) setUserConfig(userFound);
      });
    }
  }, [open, selectedGroupId, selectedUserId]);

  const handleGroupChange = (groupId: string | null) => {
    if (!groupId) return;
    setSelectedGroupId(groupId);
    const grp = MOCK_GROUPS.find((g) => g.id === groupId);
    const found = allSettings.find((s) => s.type === "group" && s.target_id === groupId);
    if (found) {
      setGroupConfig(found);
    } else {
      setGroupConfig({
        type: "group",
        target_id: groupId,
        target_name: grp?.name || groupId,
        passing_grade: 85,
        max_tajweed_mistakes: 2,
        max_makhraj_mistakes: 1,
        max_harakat_mistakes: 2,
        strictness: "strict",
        auto_notify_parent: true,
        auto_notify_admin: true,
        auto_notify_teacher: true,
        mushaf_display_format: "madinah",
      });
    }
  };

  const handleUserChange = (userId: string | null) => {
    if (!userId) return;
    setSelectedUserId(userId);
    const usr = MOCK_FRIENDS.find((f) => f.username === userId);
    const found = allSettings.find((s) => s.type === "user" && s.target_id === userId);
    if (found) {
      setUserConfig(found);
    } else {
      setUserConfig({
        type: "user",
        target_id: userId,
        target_name: usr?.name || userId,
        passing_grade: 80,
        max_tajweed_mistakes: 3,
        max_makhraj_mistakes: 2,
        max_harakat_mistakes: 3,
        strictness: "medium",
        auto_notify_parent: true,
        auto_notify_admin: false,
        auto_notify_teacher: true,
        mushaf_display_format: "madinah",
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    let targetConfig: RecitationSettingConfig;

    if (activeTab === "global") {
      targetConfig = globalConfig;
    } else if (activeTab === "group") {
      targetConfig = groupConfig;
    } else {
      targetConfig = userConfig;
    }

    try {
      await saveRecitationSetting(targetConfig);
      toast.success("Pengaturan Setoran Berhasil Disimpan", {
        description: `Konfigurasi ${activeTab.toUpperCase()} (${targetConfig.target_name || targetConfig.target_id}) telah tersinkronisasi ke Supabase & penyimpanan lokal.`,
      });
      onOpenChange(false);
    } catch {
      toast.error("Gagal menyimpan konfigurasi");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white rounded-3xl p-6 border border-gray-100 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-2xl bg-emerald-50 text-[#00875a] flex items-center justify-center">
              <Settings2 className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-gray-900 text-left flex items-center gap-2">
                <span>Pengaturan Standar Setoran & Evaluasi</span>
                <Badge className="bg-emerald-100/80 text-emerald-800 border-0 text-[10px] font-bold">
                  Supabase Synced
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 text-left">
                Kelola toleransi kesalahan tajwid, kriteria kelulusan, dan preferensi notifikasi
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* 3 Tabs: Global, Per Group, Per User */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "global" | "group" | "user")}
          className="w-full mt-2"
        >
          <TabsList className="grid w-full grid-cols-3 bg-gray-100/80 p-1 rounded-2xl">
            <TabsTrigger
              value="global"
              className="rounded-xl text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#00875a] data-[state=active]:shadow-xs gap-1.5"
            >
              <Globe className="size-3.5" />
              <span>Setting Global</span>
            </TabsTrigger>
            <TabsTrigger
              value="group"
              className="rounded-xl text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#00875a] data-[state=active]:shadow-xs gap-1.5"
            >
              <Users2 className="size-3.5" />
              <span>Setting per Grup</span>
            </TabsTrigger>
            <TabsTrigger
              value="user"
              className="rounded-xl text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#00875a] data-[state=active]:shadow-xs gap-1.5"
            >
              <UserCheck className="size-3.5" />
              <span>Setting per User</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: SETTING GLOBAL */}
          <TabsContent value="global" className="space-y-4 pt-3 text-xs">
            <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/70 text-emerald-800 text-[11px] flex items-center gap-2">
              <Sparkles className="size-4 shrink-0 text-[#00875a]" />
              <span>
                Pengaturan global berlaku sebagai nilai acuan utama (fallback) untuk semua sesi setoran yang tidak memiliki aturan spesifik per grup atau santri.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Target Skor Kelulusan Minimum (%)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="50"
                    max="100"
                    value={globalConfig.passing_grade}
                    onChange={(e) =>
                      setGlobalConfig({
                        ...globalConfig,
                        passing_grade: Number(e.target.value),
                      })
                    }
                    className="rounded-xl text-xs"
                  />
                  <span className="text-xs font-bold text-gray-500">%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Tingkat Ketat Evaluasi
                </Label>
                <Select
                  value={globalConfig.strictness}
                  onValueChange={(val: any) =>
                    setGlobalConfig({
                      ...globalConfig,
                      strictness: val || "medium",
                    })
                  }
                >
                  <SelectTrigger className="rounded-xl text-xs">
                    <SelectValue placeholder="Pilih tingkat" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl">
                    <SelectItem value="easy">Ramah / Pemula (Toleran)</SelectItem>
                    <SelectItem value="medium">Standar (Seimbang)</SelectItem>
                    <SelectItem value="strict">Ketat / Bersanad (Disiplin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Batas Maksimal Salah Tajwid
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={globalConfig.max_tajweed_mistakes}
                  onChange={(e) =>
                    setGlobalConfig({
                      ...globalConfig,
                      max_tajweed_mistakes: Number(e.target.value),
                    })
                  }
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Batas Maksimal Salah Makhraj
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={globalConfig.max_makhraj_mistakes}
                  onChange={(e) =>
                    setGlobalConfig({
                      ...globalConfig,
                      max_makhraj_mistakes: Number(e.target.value),
                    })
                  }
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2.5">
              <span className="text-xs font-bold text-gray-900 block">
                Otomatisasi Notifikasi Hasil:
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-700">Kirim email otomatis ke Orang Tua</span>
                <Switch
                  checked={globalConfig.auto_notify_parent}
                  onCheckedChange={(c: boolean) =>
                    setGlobalConfig({ ...globalConfig, auto_notify_parent: c })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-700">Kirim notifikasi ke Admin Grup</span>
                <Switch
                  checked={globalConfig.auto_notify_admin}
                  onCheckedChange={(c: boolean) =>
                    setGlobalConfig({ ...globalConfig, auto_notify_admin: c })
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: SETTING PER GRUP */}
          <TabsContent value="group" className="space-y-4 pt-3 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Pilih Grup Al-Qur&apos;an</Label>
              <Select value={selectedGroupId} onValueChange={handleGroupChange}>
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue placeholder="Pilih Grup" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl">
                  {MOCK_GROUPS.map((grp) => (
                    <SelectItem key={grp.id} value={grp.id}>
                      {grp.name} ({grp.description || "Grup Santri"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Target Kelulusan Grup (%)
                </Label>
                <Input
                  type="number"
                  min="50"
                  max="100"
                  value={groupConfig.passing_grade}
                  onChange={(e) =>
                    setGroupConfig({
                      ...groupConfig,
                      passing_grade: Number(e.target.value),
                    })
                  }
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Toleransi Kesalahan Tajwid
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={groupConfig.max_tajweed_mistakes}
                  onChange={(e) =>
                    setGroupConfig({
                      ...groupConfig,
                      max_tajweed_mistakes: Number(e.target.value),
                    })
                  }
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2.5">
              <span className="text-xs font-bold text-gray-900 block">
                Notifikasi Khusus Anggota Grup Ini:
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-700">
                  Notifikasi ke Pembimbing / Admin Grup
                </span>
                <Switch
                  checked={groupConfig.auto_notify_admin}
                  onCheckedChange={(c: boolean) =>
                    setGroupConfig({ ...groupConfig, auto_notify_admin: c })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-700">
                  Kirim salinan otomatis ke email orang tua santri grup ini
                </span>
                <Switch
                  checked={groupConfig.auto_notify_parent}
                  onCheckedChange={(c: boolean) =>
                    setGroupConfig({ ...groupConfig, auto_notify_parent: c })
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: SETTING PER USER */}
          <TabsContent value="user" className="space-y-4 pt-3 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Pilih Santri / Teman</Label>
              <Select value={selectedUserId} onValueChange={handleUserChange}>
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue placeholder="Pilih Santri" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl">
                  {MOCK_FRIENDS.map((f) => (
                    <SelectItem key={f.username} value={f.username}>
                      {f.name} (@{f.username})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Target Khusus Santri (%)
                </Label>
                <Input
                  type="number"
                  min="50"
                  max="100"
                  value={userConfig.passing_grade}
                  onChange={(e) =>
                    setUserConfig({
                      ...userConfig,
                      passing_grade: Number(e.target.value),
                    })
                  }
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Toleransi Kesalahan Makhraj
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={userConfig.max_makhraj_mistakes}
                  onChange={(e) =>
                    setUserConfig({
                      ...userConfig,
                      max_makhraj_mistakes: Number(e.target.value),
                    })
                  }
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2.5">
              <span className="text-xs font-bold text-gray-900 block">
                Notifikasi Langsung:
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-700">
                  Kirim raport instan ke Email Orang Tua santri ini
                </span>
                <Switch
                  checked={userConfig.auto_notify_parent}
                  onCheckedChange={(c: boolean) =>
                    setUserConfig({ ...userConfig, auto_notify_parent: c })
                  }
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex sm:justify-end gap-2 pt-3 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs font-semibold cursor-pointer"
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-[#00875a] hover:bg-[#00754e] text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Save className="size-3.5" />
            <span>{isSaving ? "Menyimpan..." : "Simpan Pengaturan"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
