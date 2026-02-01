"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MessageSquare, FolderOpen, Grid, Settings, Wifi, WifiOff, Sun, Moon } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Grid },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/tools", label: "Tools", icon: FolderOpen },
  { href: "/files", label: "Files", icon: FolderOpen },
];

export default function NavBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [isDark, setIsDark] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const engine = process.env.NEXT_PUBLIC_SEARCH_ENGINE || "ddg";
      const url = engine === "google" 
        ? `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
        : `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`;
      window.open(url, "_blank");
    }
  };

  return (
    <nav className="glass sticky top-0 z-50 mx-4 mt-4 rounded-2xl px-6 py-3">
      <div className="flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white">
            OC
          </div>
          <span className="text-xl font-bold hidden sm:block">OpenClaw Home</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the web..."
              className="glass-input w-full pl-10 pr-4 py-2"
            />
          </div>
        </form>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="glass-button flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Status Icons */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`glass-button p-2 ${isOnline ? 'text-green-400' : 'text-red-400'}`}
          >
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className="glass-button p-2"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
