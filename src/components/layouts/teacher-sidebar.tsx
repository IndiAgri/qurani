"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import {
  Home,
  SlidersHorizontal,
  BookOpen,
  CalendarDays,
  Users,
  Award,
  MessageSquare,
  Wallet,
  Building2,
  Settings,
  PanelLeftClose,
  ChevronsUpDown,
  LogOut,
  User as UserIcon,
  ShieldAlert,
  GraduationCap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/providers/auth-provider";

export function TeacherSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const currentLocale = pathname.startsWith("/id") ? "id" : "en";
  const { toggleSidebar, state } = useSidebar();
  const { user, logout } = useAuth();
  const isCollapsed = state === "collapsed";

  const teacherId = (params?.id as string) || "1";

  const navItems = [
    {
      title: "Teacher Dashboard",
      idTitle: "Dashboard Guru",
      url: `/${currentLocale}/teachers/${teacherId}/dashboard`,
      icon: Home,
      match: "dashboard",
    },
    {
      title: "Orders",
      idTitle: "Pesanan",
      url: `/${currentLocale}/teachers/${teacherId}/orders`,
      icon: SlidersHorizontal,
      match: "orders",
    },
    {
      title: "Courses",
      idTitle: "Kursus",
      url: `/${currentLocale}/teachers/${teacherId}/courses`,
      icon: BookOpen,
      match: "courses",
    },
    {
      title: "Schedules",
      idTitle: "Jadwal",
      url: `/${currentLocale}/teachers/${teacherId}/schedules`,
      icon: CalendarDays,
      match: "schedules",
    },
    {
      title: "Students",
      idTitle: "Santri",
      url: `/${currentLocale}/teachers/${teacherId}/students`,
      icon: Users,
      match: "students",
    },
    {
      title: "Certificates",
      idTitle: "Sertifikat",
      url: `/${currentLocale}/teachers/${teacherId}/certificates`,
      icon: Award,
      match: "certificates",
    },
    {
      title: "Messages",
      idTitle: "Pesan",
      url: `/${currentLocale}/teachers/${teacherId}/messages`,
      icon: MessageSquare,
      match: "messages",
    },
    {
      title: "Earnings",
      idTitle: "Pendapatan",
      url: `/${currentLocale}/teachers/${teacherId}/earnings`,
      icon: Wallet,
      match: "earnings",
    },
    {
      title: "Organization",
      idTitle: "Organisasi",
      url: `/${currentLocale}/teachers/${teacherId}/organization`,
      icon: Building2,
      match: "organization",
    },
    {
      title: "Settings",
      idTitle: "Pengaturan",
      url: `/${currentLocale}/teachers/${teacherId}/settings`,
      icon: Settings,
      match: "settings",
    },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-gray-100 bg-white shadow-xs"
    >
      {/* Sidebar Header: Logo */}
      <SidebarHeader className="h-16 flex items-center justify-start px-5 border-b border-transparent">
        <Link href={`/${currentLocale}/dashboard`} className="flex items-center gap-2">
          {isCollapsed ? (
            <div className="relative w-8 h-8">
              <Image
                src="/icons/Qurani - Icon2 Green.png"
                alt="Qurani"
                fill
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="relative w-32 h-8">
              <Image
                src="/icons/Qurani - Logo Green.png"
                alt="Qurani"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          )}
        </Link>
      </SidebarHeader>

      {/* Sidebar Content: Navigation */}
      <SidebarContent className="px-3 py-2 space-y-1">
        <SidebarMenu className="gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.includes(item.match);
            const title = currentLocale === "id" ? item.idTitle : item.title;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={title}
                  render={<Link href={item.url} />}
                  className={`h-10 px-3.5 rounded-xl font-normal text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-[#00875a] text-white hover:bg-[#007a51] hover:text-white font-medium shadow-xs"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                  }`}
                >
                  <Icon className="size-4.5 shrink-0" />
                  <span className="truncate">{title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Sidebar Footer: Close sidebar button & User Profile */}
      <SidebarFooter className="p-3 space-y-2 border-t border-gray-100/60">
        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            type="button"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200/90 rounded-xl transition shadow-2xs cursor-pointer"
          >
            <PanelLeftClose className="size-4 text-gray-600 shrink-0" />
            <span>{currentLocale === "id" ? "Tutup sidebar" : "Close sidebar"}</span>
          </button>
        )}

        {/* User profile dropdown matching Teacher Account */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-100/80 transition-all text-left focus:outline-none cursor-pointer">
                <div className="relative size-8 rounded-full overflow-hidden border border-gray-200 shrink-0">
                  <Image
                    src="/img/fatkul.jpg"
                    alt="fatkul"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="grid flex-1 text-left text-xs leading-tight ml-1">
                  <span className="truncate font-semibold text-gray-900">
                    fatkul
                  </span>
                  <span className="truncate text-[11px] text-gray-500">
                    @fatkul
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-3.5 text-gray-400 shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-52 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 mb-2"
                side="top"
                align="start"
              >
                <div className="space-y-0.5">
                  <DropdownMenuItem
                    onClick={() => router.push(`/${currentLocale}/teachers/${teacherId}/dashboard`)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-normal text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800/70 rounded-xl cursor-pointer"
                  >
                    <GraduationCap className="size-4.5 text-gray-700 dark:text-gray-300 shrink-0" />
                    <span>Dashboard Guru</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(`/${currentLocale}/teachers/${teacherId}/profile`)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-normal text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800/70 rounded-xl cursor-pointer"
                  >
                    <UserIcon className="size-4.5 text-gray-700 dark:text-gray-300 shrink-0" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(`/${currentLocale}/dashboard`)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20 rounded-xl cursor-pointer"
                  >
                    <Users className="size-4.5 text-emerald-600 shrink-0" />
                    <span>Akun Santri (fatkul)</span>
                  </DropdownMenuItem>
                </div>
                <div className="border-t border-gray-100 dark:border-slate-800 my-1 p-0" />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-normal text-red-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl cursor-pointer"
                >
                  <LogOut className="size-4.5 text-red-500 shrink-0" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
