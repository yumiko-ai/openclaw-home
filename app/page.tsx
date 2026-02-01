import { Clock, Calendar, Cloud, FileText, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const quickActions = [
  { label: "New Chat", href: "/chat", icon: Sparkles, color: "from-purple-500 to-pink-500" },
  { label: "Upload Files", href: "/files", icon: FileText, color: "from-blue-500 to-cyan-500" },
  { label: "View Tools", href: "/tools", icon: ArrowRight, color: "from-green-500 to-emerald-500" },
];

const widgets = [
  { 
    title: "Time", 
    icon: Clock,
    content: () => <TimeWidget />
  },
  { 
    title: "Calendar", 
    icon: Calendar,
    content: () => <div className="text-white/60 text-sm">No upcoming events</div>
  },
  { 
    title: "Weather", 
    icon: Cloud,
    content: () => <WeatherWidget />
  },
];

function TimeWidget() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useState(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div className="text-center">
      <div className="text-4xl font-bold">{time}</div>
      <div className="text-white/60 text-sm mt-1">{date}</div>
    </div>
  );
}

function WeatherWidget() {
  const [weather, setWeather] = useState<{ temp: number; condition: string } | null>(null);

  useState(() => {
    // Simple weather display - can be expanded with real API
    setWeather({ temp: 72, condition: "Sunny" });
  });

  return weather ? (
    <div className="text-center">
      <div className="text-3xl font-bold">{weather.temp}°F</div>
      <div className="text-white/60 text-sm">{weather.condition}</div>
    </div>
  ) : null;
}

import { useState, useEffect } from "react";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
        <p className="text-white/60">Your command center is ready</p>
      </header>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="glass-card p-6 group"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${action.color} mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-1 group-hover:text-purple-300 transition-colors">
                {action.label}
              </h3>
              <p className="text-white/60 text-sm">
                Click to get started →
              </p>
            </Link>
          );
        })}
      </section>

      {/* Widgets Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {widgets.map((widget) => (
          <div key={widget.title} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <widget.icon className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold">{widget.title}</h2>
            </div>
            <widget.content />
          </div>
        ))}
      </section>

      {/* Recent Activity */}
      <section className="mt-8">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="text-white/60 text-sm">
            No recent activity. Start a conversation to see updates here.
          </div>
        </div>
      </section>
    </div>
  );
}
