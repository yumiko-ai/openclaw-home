"use client";

import { useState } from "react";
import { FolderOpen, ExternalLink, Terminal, Plus, Settings } from "lucide-react";

interface Tool {
  name: string;
  description: string;
  icon: string;
  href?: string;
  command?: string;
  status?: "online" | "offline" | "unknown";
}

// Add your tools here - easy to extend!
const tools: Tool[] = [
  {
    name: "DramaAlert",
    description: "Generate YouTube-style thumbnail images",
    icon: "🎨",
    href: "http://100.88.15.95:5050",
    status: "online",
  },
  {
    name: "File Server",
    description: "Upload and manage files",
    icon: "📁",
    href: "http://100.88.15.95:8080",
    status: "online",
  },
  {
    name: "Memory",
    description: "View and edit memory files",
    icon: "🧠",
    href: "/files?folder=memory",
    status: "unknown",
  },
  {
    name: "OpenClaw Gateway",
    description: "Main OpenClaw service",
    icon: "⚙️",
    command: "openclaw gateway status",
    status: "unknown",
  },
];

const categories = [
  { name: "All", icon: "🌐" },
  { name: "Generators", icon: "🎨" },
  { name: "Servers", icon: "🖥️" },
  { name: "Files", icon: "📁" },
  { name: "Utilities", icon: "🔧" },
];

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === "All" || 
      tool.name.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Tools</h1>
          <p className="text-white/60">Quick access to all your OpenClaw tools</p>
        </div>
        <button className="glass-button flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Tool
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`glass-button whitespace-nowrap ${
              selectedCategory === cat.name ? "bg-purple-500/20 border-purple-500/30" : ""
            }`}
          >
            <span className="mr-2">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tools..."
          className="glass-input w-full max-w-md"
        />
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <div key={tool.name} className="glass-card p-6 group">
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{tool.icon}</div>
              {tool.status && (
                <div
                  className={`w-3 h-3 rounded-full ${
                    tool.status === "online"
                      ? "bg-green-400"
                      : tool.status === "offline"
                      ? "bg-red-400"
                      : "bg-yellow-400"
                  }`}
                />
              )}
            </div>

            <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-300 transition-colors">
              {tool.name}
            </h3>
            <p className="text-white/60 text-sm mb-4">{tool.description}</p>

            <div className="flex gap-2">
              {tool.href && (
                <a
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-button flex items-center gap-2 flex-1 justify-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open
                </a>
              )}
              {tool.command && (
                <button className="glass-button flex items-center gap-2 flex-1 justify-center">
                  <Terminal className="w-4 h-4" />
                  Run
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTools.length === 0 && (
        <div className="glass-card p-12 text-center">
          <p className="text-white/60">No tools found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
