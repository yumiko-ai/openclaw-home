"use client";

import { useState, useRef, useCallback } from "react";
import { Send, Paperclip, X, File, Image, FileText, Loader2, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  files?: { name: string; type: string; url: string }[];
  timestamp: Date;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  preview?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey! I'm Yumiko. Drag files here to upload them, then give me instructions. What would you like to do?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useState(() => {
    scrollToBottom();
  });

  const handleFileUpload = useCallback(async (files: FileList) => {
    const newFiles: UploadedFile[] = [];

    for (const file of Array.from(files)) {
      const id = Math.random().toString(36).slice(2);
      let preview: string | undefined;

      if (file.type.startsWith("image/")) {
        preview = URL.createObjectURL(file);
      }

      newFiles.push({
        id,
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        preview,
      });
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const sendMessage = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      files: uploadedFiles.map((f) => ({
        name: f.name,
        type: f.type,
        url: f.preview || "",
      })),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate response - connect to real API later
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I received your message and files! This is a placeholder response. Connect to the OpenClaw API to get real responses.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.startsWith("text/") || type.includes("document")) return FileText;
    return File;
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Chat Header */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold">Chat with Yumiko</h1>
            <p className="text-white/60 text-sm">Drag files to upload, then chat</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto glass-card p-4 space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div className={message.role === "user" ? "chat-user" : "chat-assistant"}>
              {message.files && message.files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {message.files.map((file, idx) => {
                    const Icon = getFileIcon(file.type);
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-sm"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="truncate max-w-[150px]">{file.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs text-white/40 mt-2 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="chat-assistant flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="glass-card p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Paperclip className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/60">Attached files:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file) => {
              const Icon = getFileIcon(file.type);
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 group"
                >
                  {file.preview ? (
                    <img src={file.preview} alt={file.name} className="w-6 h-6 rounded object-cover" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="text-sm truncate max-w-[120px]">{file.name}</span>
                  <span className="text-xs text-white/40">{file.size}</span>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 rounded hover:bg-white/20 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Drop Zone & Input */}
      <div
        className={`drop-zone p-1 ${isDragOver ? "active" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="glass rounded-xl p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Type your message or drag files..."
              className="flex-1 glass-input"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
              className="glass-button bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-white/40 mt-2 text-center">
            Drag and drop files anywhere to upload
          </p>
        </div>
      </div>
    </div>
  );
}
