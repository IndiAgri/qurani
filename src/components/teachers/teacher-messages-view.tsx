"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Mic,
  Video,
  CheckCheck,
  MoreVertical,
  Phone,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  package: string;
}

interface Message {
  id: string;
  sender: "teacher" | "student";
  text: string;
  time: string;
}

const INITIAL_CONTACTS: ChatContact[] = [
  {
    id: "c-1",
    name: "Siti Rahmawati",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    lastMessage: "Ustadz, apakah sesi jam 08:00 besok bisa via Google Meet?",
    time: "10:15",
    unread: 1,
    online: true,
    package: "Tahsin Intensif",
  },
  {
    id: "c-2",
    name: "Ahmad Fauzi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    lastMessage: "Alhamdulillah saya sudah hafal An-Naba 1-20 ustadz.",
    time: "Kemarin",
    unread: 0,
    online: false,
    package: "Tahfidz Pemula",
  },
  {
    id: "c-3",
    name: "Lailatul Munawaroh",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    lastMessage: "Jazakallahu khairan ustadz atas bimbingan tajwidnya.",
    time: "02 Feb",
    unread: 0,
    online: false,
    package: "Tajwid Mahir",
  },
];

export function TeacherMessagesView({ teacherId = "1" }: { teacherId?: string }) {
  const [contacts, setContacts] = useState<ChatContact[]>(INITIAL_CONTACTS);
  const [activeContact, setActiveContact] = useState<ChatContact>(INITIAL_CONTACTS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputMessage, setInputMessage] = useState("");

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "c-1": [
      {
        id: "m-1",
        sender: "teacher",
        text: "Assalamu'alaikum Siti, bagaimana progres hafalan surat Al-Baqarah ayat 151-155?",
        time: "09:30",
      },
      {
        id: "m-2",
        sender: "student",
        text: "Wa'alaikumussalam ustadz. Alhamdulillah sudah lancar, tinggal memantapkan mad wajib muttashil.",
        time: "09:45",
      },
      {
        id: "m-3",
        sender: "student",
        text: "Ustadz, apakah sesi jam 08:00 besok bisa via Google Meet?",
        time: "10:15",
      },
    ],
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: "teacher",
      text: inputMessage.trim(),
      time: "Sekarang",
    };

    setMessages((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
    }));

    setInputMessage("");
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMessages = messages[activeContact.id] || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100/90 dark:border-slate-800 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
        {/* Left Panel: Contacts (md:col-span-5 lg:col-span-4) */}
        <div className="md:col-span-5 lg:col-span-4 border-r border-gray-100 dark:border-slate-800 flex flex-col">
          {/* Header & Search */}
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Pesan Santri
              </h2>
              <span className="text-xs text-gray-400">
                {contacts.length} Percakapan
              </span>
            </div>
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari santri..."
                className="h-9 rounded-xl pl-9 text-xs"
              />
              <Search className="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-800/60">
            {filteredContacts.map((contact) => {
              const isActive = contact.id === activeContact.id;
              return (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => setActiveContact(contact)}
                  className={`w-full p-4 flex items-start gap-3.5 text-left transition cursor-pointer ${
                    isActive
                      ? "bg-emerald-50/70 dark:bg-emerald-950/40"
                      : "hover:bg-gray-50/80 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="relative size-11 rounded-full overflow-hidden border border-gray-200 shrink-0">
                    <Image
                      src={contact.avatar}
                      alt={contact.name}
                      fill
                      className="object-cover"
                    />
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {contact.name}
                      </h4>
                      <span className="text-[10px] text-gray-400">{contact.time}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block">
                      {contact.package}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {contact.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Chat Thread (md:col-span-7 lg:col-span-8) */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between">
          {/* Thread Header */}
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative size-10 rounded-full overflow-hidden border border-gray-200 shrink-0">
                <Image
                  src={activeContact.avatar}
                  alt={activeContact.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  {activeContact.name}
                </h3>
                <span className="text-[11px] text-gray-400">
                  {activeContact.online ? "Online" : "Terakhir aktif 1 jam lalu"} • {activeContact.package}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://meet.google.com/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs"
                >
                  <Video className="size-3.5 mr-1" />
                  <span>Google Meet</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Messages Area */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4 bg-gray-50/40 dark:bg-slate-900/60">
            {activeMessages.map((msg) => {
              const isTeacher = msg.sender === "teacher";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isTeacher ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isTeacher
                        ? "bg-[#00875a] text-white rounded-br-xs"
                        : "bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-700 rounded-bl-xs shadow-2xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3.5 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900"
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tulis pesan atau bimbingan tajwid..."
              className="h-10 rounded-xl text-xs flex-1"
            />
            <Button
              type="submit"
              size="icon"
              className="size-10 rounded-xl bg-[#00875a] hover:bg-[#007a51] text-white shrink-0 cursor-pointer shadow-xs"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
