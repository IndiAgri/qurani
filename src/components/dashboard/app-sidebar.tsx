"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  Wallet,
  MessageSquare,
  Download,
  Info,
  HelpCircle,
  PanelLeftClose,
  ChevronsUpDown,
  LogOut,
  User as UserIcon,
  Settings,
  Receipt,
  ShieldAlert,
  Bell,
} from "lucide-react";
import { getUnreadNotificationsCount } from "@/lib/notifications";
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/providers/auth-provider";

// Custom 4-diamonds icon for "Groups" matching Qurani's icon
function GroupsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || "size-4.5"}
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

const navItems = [
  {
    title: "Dashboard",
    url: "/en/dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    title: "Recitation",
    url: "/en/recitation",
    icon: BookOpen,
  },
  {
    title: "Teachers",
    url: "/en/teachers",
    icon: GraduationCap,
  },
  {
    title: "Friends",
    url: "/en/friend",
    icon: Users,
  },
  {
    title: "Groups",
    url: "/en/groups",
    customIcon: GroupsIcon,
  },
  {
    title: "Notifications",
    url: "/en/notifications",
    icon: Bell,
  },
  {
    title: "Wallet",
    url: "/en/wallet",
    icon: Wallet,
  },
  {
    title: "Chat",
    url: "/en/chat",
    icon: MessageSquare,
  },
  {
    title: "Install App",
    url: "/en/install-app",
    icon: Download,
  },
  {
    title: "About",
    url: "/en/about",
    icon: Info,
  },
  {
    title: "Support",
    url: "/en/support",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = pathname.startsWith("/id") ? "id" : "en";
  const { toggleSidebar, state } = useSidebar();
  const { user, logout } = useAuth();
  const isCollapsed = state === "collapsed";

  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    setUnreadCount(getUnreadNotificationsCount());
    const handleUpdate = () => {
      setUnreadCount(getUnreadNotificationsCount());
    };
    window.addEventListener("qurani_notifications_updated", handleUpdate);
    window.addEventListener("qurani_new_recitation_notification", handleUpdate);
    return () => {
      window.removeEventListener("qurani_notifications_updated", handleUpdate);
      window.removeEventListener("qurani_new_recitation_notification", handleUpdate);
    };
  }, []);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-gray-100 bg-white shadow-xs"
    >
      {/* Sidebar Header: Logo */}
      <SidebarHeader className="h-16 flex items-center justify-start px-5 border-b border-transparent">
        <Link href="/en/dashboard" className="flex items-center gap-2">
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
            const CustomIcon = item.customIcon;
            const itemUrl = pathname.startsWith("/id") ? item.url.replace(/^\/en/, "/id") : item.url;
            const isActive =
              pathname === itemUrl ||
              pathname === item.url ||
              (item.url === "/en/dashboard" && (pathname === "/" || pathname === "/id/dashboard" || pathname === "/dashboard")) ||
              (item.title === "Friends" && (pathname.includes("/friend") || pathname.includes("/friends"))) ||
              (item.title === "Groups" && pathname.includes("/groups")) ||
              (item.title === "Notifications" && pathname.includes("/notifications")) ||
              (item.title === "Wallet" && pathname.includes("/wallet")) ||
              (item.title === "Chat" && pathname.includes("/chat")) ||
              (item.title === "Orders" && pathname.includes("/orders")) ||
              (item.title === "Teachers" && pathname.includes("/teachers") && !pathname.includes("/orders"));

            const ID_TITLES: Record<string, string> = {
              Dashboard: "Dashboard",
              Recitation: "Setoran",
              Teachers: "Guru",
              Friends: "Teman",
              Groups: "Grup",
              Notifications: "Notifikasi",
              Wallet: "Dompet",
              Chat: "Pesan",
              "Install App": "Install App",
              About: "Tentang",
              Support: "Dukungan",
            };

            const displayTitle = currentLocale === "id" ? (ID_TITLES[item.title] || item.title) : item.title;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={displayTitle}
                  render={<Link href={itemUrl} />}
                  className={`h-10 px-3.5 rounded-xl font-normal text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-[#00875a] text-white hover:bg-[#007a51] hover:text-white font-medium shadow-xs"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                  }`}
                >
                  {CustomIcon ? (
                    <CustomIcon className="size-4.5 shrink-0" />
                  ) : (
                    Icon && <Icon className="size-4.5 shrink-0" />
                  )}
                  <span className="truncate">{displayTitle}</span>
                  {item.title === "Notifications" && unreadCount > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shrink-0 shadow-xs">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Sidebar Footer: Close sidebar button & User Profile */}
      <SidebarFooter className="p-3 space-y-2 border-t border-gray-100/60">
        {/* Close sidebar button */}
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

        {/* User profile dropdown */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center gap-2 rounded-xl hover:bg-gray-100/70 p-1.5 transition text-left cursor-pointer focus:outline-none">
                {user?.avatar && (user.avatar.startsWith("/") || user.avatar.startsWith("http")) ? (
                  <div className="relative size-8.5 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    <Image
                      src={user.avatar}
                      alt={user?.name || "indi"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="size-8.5 rounded-lg bg-[#1e5d22] text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase select-none">
                    {(user?.name || "indi").charAt(0)}
                  </div>
                )}
                <div className="grid flex-1 text-left text-xs leading-tight ml-1">
                  <span className="truncate font-semibold text-gray-900">
                    {user?.name || "indi"}
                  </span>
                  <span className="truncate text-[11px] text-gray-500">
                    {user?.username ? (user.username.startsWith("@") ? user.username : `@${user.username}`) : "@indiagri"}
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
                    onClick={() => router.push(`/${currentLocale}/teachers/1/dashboard`)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-normal text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800/70 rounded-xl cursor-pointer"
                  >
                    <GraduationCap className="size-4.5 text-gray-700 dark:text-gray-300 shrink-0" />
                    <span>Dashboard Guru</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(`/${currentLocale}/profile`)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-normal text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800/70 rounded-xl cursor-pointer"
                  >
                    <UserIcon className="size-4.5 text-gray-700 dark:text-gray-300 shrink-0" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                </div>
                <div className="border-t border-gray-100 dark:border-slate-800 my-1 p-0" />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-normal text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800/70 rounded-xl cursor-pointer"
                >
                  <LogOut className="size-4.5 text-gray-700 dark:text-gray-300 shrink-0" />
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
