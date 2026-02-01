"use client";

import { useState, useRef, useCallback } from "react";
import { 
  Upload, File, Image, FileText, Music, Video, Archive, 
  Folder, Download, Trash2, Grid, List, Search, Cloud 
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  preview?: string;
}

const fileCategories = [
  { name: "images", icon: Image, extensions: ["png", "jpg", "jpeg", "gif", "webp", "svg"] },
  { name: "documents", icon: FileText, extensions: ["pdf", "doc", "docx", "txt", "md"] },
  { name: "audio", icon: Music, extensions: ["mp3", "wav", "m4a", "aac"] },
  { name: "video", icon: Video, extensions: ["mp4", "mov", "avi", "mkv"] },
  { name: "archives", icon: Archive, extensions: ["zip", "rar", "7z"] },
];

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolder, setCurrentFolder] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
  };

  const uploadFiles = (fileList: FileList) => {
    const newFiles: FileItem[] = [];

    for (const file of Array.from(fileList)) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;

      newFiles.push({
        id: Math.random().toString(36).slice(2),
        name: file.name,
        type: getFileCategory(ext),
        size: formatFileSize(file.size),
        modified: new Date().toLocaleDateString(),
        preview,
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const getFileCategory = (ext: string) => {
    for (const cat of fileCategories) {
      if (cat.extensions.includes(ext)) return cat.name;
    }
    return "other";
  };

  const getFileIcon = (type: string) => {
    const cat = fileCategories.find((c) => c.name === type);
    return cat?.icon || File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = currentFolder === "all" || file.type === currentFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Files</h1>
          <p className="text-white/60">Upload and manage your files</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="glass-button flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30"
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Drop Zone */}
      <div
        className={`drop-zone p-8 mb-8 text-center ${isDragOver ? "active" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <Cloud className="w-12 h-12 mx-auto mb-4 text-white/40" />
        <p className="text-lg mb-2">Drag and drop files here</p>
        <p className="text-white/60 text-sm">or click to browse</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Folder Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setCurrentFolder("all")}
            className={`glass-button whitespace-nowrap ${
              currentFolder === "all" ? "bg-purple-500/20 border-purple-500/30" : ""
            }`}
          >
            <Folder className="w-4 h-4 mr-2" />
            All
          </button>
          {fileCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => setCurrentFolder(cat.name)}
                className={`glass-button whitespace-nowrap capitalize ${
                  currentFolder === cat.name ? "bg-purple-500/20 border-purple-500/30" : ""
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="glass-input pl-9 pr-4 py-2 w-48"
            />
          </div>

          {/* View Toggle */}
          <div className="flex glass rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Files Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map((file) => {
            const Icon = getFileIcon(file.type);
            return (
              <div key={file.id} className="glass-card p-4 group">
                <div className="aspect-square flex items-center justify-center mb-3">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Icon className="w-12 h-12 text-white/40" />
                  )}
                </div>
                <p className="text-sm truncate mb-1">{file.name}</p>
                <p className="text-xs text-white/40">{file.size}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/60 text-sm font-normal">Name</th>
                <th className="text-left p-4 text-white/60 text-sm font-normal">Type</th>
                <th className="text-left p-4 text-white/60 text-sm font-normal">Size</th>
                <th className="text-left p-4 text-white/60 text-sm font-normal">Modified</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => {
                const Icon = getFileIcon(file.type);
                return (
                  <tr key={file.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {file.preview ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <Icon className="w-5 h-5 text-white/40" />
                        )}
                        <span className="truncate max-w-[200px]">{file.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-white/60 capitalize">{file.type}</td>
                    <td className="p-4 text-white/60">{file.size}</td>
                    <td className="p-4 text-white/60">{file.modified}</td>
                    <td className="p-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white/10 rounded-lg">
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setFiles(files.filter(f => f.id !== file.id))}
                          className="p-2 hover:bg-red-500/20 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Folder className="w-16 h-16 mx-auto mb-4 text-white/20" />
          <p className="text-white/60 mb-4">No files yet</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="glass-button"
          >
            Upload your first file
          </button>
        </div>
      )}
    </div>
  );
}
