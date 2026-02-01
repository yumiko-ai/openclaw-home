# OpenClaw Home

A modern, glassmorphic dashboard framework for OpenClaw. Features chat with file uploads, tool management, and dynamic page generation.

![Dashboard Preview](https://via.placeholder.com/800x400/1a1a2e/8b5cf6?text=OpenClaw+Home)

## Features

- 💬 **Chat Interface** - ChatGPT-style interface with drag-and-drop file uploads
- 🎨 **Glassmorphic Design** - Modern dark theme with frosted glass effects
- 📁 **File Management** - Upload, preview, and manage files
- 🛠️ **Tool Dashboard** - Quick access to all your OpenClaw tools
- 🔍 **Search Bar** - Quick web search (Google or DuckDuckGo)
- ⚡ **Dynamic Pages** - Easy to add new pages on the fly
- 🔒 **Privacy First** - No sensitive data in the repo; all config via environment variables

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yumiko-ai/openclaw-home.git
cd openclaw-home

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your settings
nano .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

Create a `.env.local` file with your settings:

```env
# OpenClaw Gateway URL (local)
NEXT_PUBLIC_OPENCLAW_URL=http://localhost:3000

# File Server URL
NEXT_PUBLIC_FILE_SERVER_URL=http://localhost:8080

# Search Engine ('google' or 'ddg')
NEXT_PUBLIC_SEARCH_ENGINE=ddg

# App Title
NEXT_PUBLIC_APP_NAME=OpenClaw Home

# Enable/Disable Features
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_UPLOAD=true
NEXT_PUBLIC_ENABLE_TOOLS=true
```

## Project Structure

```
openclaw-home/
├── app/
│   ├── api/              # API routes
│   │   ├── chat/         # Chat endpoint
│   │   └── upload/       # File upload endpoint
│   ├── chat/             # Chat page
│   ├── files/            # File manager page
│   ├── tools/            # Tools dashboard page
│   ├── globals.css       # Global styles + glassmorphism
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
│   ├── NavBar.tsx        # Glass navigation bar
│   └── ...
├── public/               # Static assets
└── .env.example          # Environment template
```

## Adding New Pages

Next.js App Router auto-routes files in `app/`. To add a new page:

1. Create a folder in `app/`, e.g., `app/my-tool/`
2. Add a `page.tsx` file:

```tsx
export default function MyToolPage() {
  return (
    <div>
      <h1>My Tool</h1>
      <p>Custom tool content here</p>
    </div>
  );
}
```

The page is now accessible at `/my-tool` and automatically appears in the navbar if you update `components/NavBar.tsx`.

## Adding New Tools

Edit `app/tools/page.tsx` and add your tool to the `tools` array:

```tsx
const tools: Tool[] = [
  {
    name: "My Tool",
    description: "What it does",
    icon: "🔧",
    href: "http://localhost:3001",  // or command for terminal
    status: "online", // online, offline, unknown
  },
  // ... more tools
];
```

## Connecting to OpenClaw

### Chat Integration

Edit `app/api/chat/route.ts` to connect to your OpenClaw instance:

```typescript
// Example: Call OpenClaw API
const response = await fetch(`${process.env.NEXT_PUBLIC_OPENCLAW_URL}/api/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message, files }),
});
```

### File Upload

Files are saved to `public/uploads/` by default. To connect to your file server:

1. Set `NEXT_PUBLIC_FILE_SERVER_URL` in `.env.local`
2. Update `app/api/upload/route.ts` to proxy uploads to your server

## Customization

### Colors

Edit `app/globals.css` to change the theme:

```css
:root {
  --accent: #8b5cf6; /* Change purple to your preferred color */
  --background: #0f0f23; /* Dark background */
}
```

### Glass Effect

Adjust glassmorphism in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      glass: {
        100: 'rgba(255, 255, 255, 0.1)',
        200: 'rgba(255, 255, 255, 0.15)',
        border: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
}
```

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Lucide Icons](https://lucide.dev/) - Icons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use and modify!

## Author

[Yumiko AI](https://github.com/yumiko-ai)

---

**Note:** This is a framework/template. No sensitive data is included. Configure your own OpenClaw instance by setting environment variables.
