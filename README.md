# Inscribe ✍️

_A modern, local-first note-taking application with AI-powered writing assistance_

> **Scribble Smarter With Inscribe** - Capture ideas. Organize everything. Think clearly.

## 🌟 Overview

**Inscribe** is a sophisticated note-taking application that combines the power of modern web technologies with a custom-built rich text editor. Designed with a local-first approach, it ensures your notes are always available, with seamless background synchronization when online.

### Key Highlights

✨ **Custom Rich Text Editor** - Built from scratch with advanced features  
🚀 **Local-First Architecture** - Instant access, background sync  
🤖 **AI Writing Assistant** - Integrated AI-powered text generation  
⚡ **Real-Time Performance** - Optimized for speed and responsiveness  
🎨 **Beautiful UI/UX** - Modern design with accessibility in mind  
📱 **Cross-Platform** - Works seamlessly across all devices

## 🛠️ Technical Architecture

### **Frontend Stack**

- **Next.js 15** with React 19 - Latest web technologies
- **TypeScript** - Full type safety throughout
- **Tailwind CSS + Radix UI** - Modern, accessible component system
- **Dexie (IndexedDB)** - Local database for offline-first functionality
- **tRPC** - End-to-end typesafe APIs

### **Backend & Infrastructure**

- **Prisma + PostgreSQL** - Robust data persistence
- **Better Auth** - Secure authentication system
- **Real-time Sync** - Custom operation queue and conflict resolution

### **AI Integration**

- **Google AI SDK** - Contextual writing assistance
- **Streaming Responses** - Real-time AI text generation
- **Inline Prompts** - AI assistance directly in the editor

## 🎯 Core Features

### **Rich Text Editor**

a completely custom-built editor with:

- **Advanced Text Formatting**: Bold, italic, underline, strikethrough, superscript, subscript
- **Semantic Structure**: H1-H4 headings, blockquotes, separators
- **Smart Lists**: Unordered, ordered, and interactive checklists with nested indentation
- **Text Alignment**: Left, center, right, and justified alignment
- **Highlight Colors**: 8 customizable highlight colors
- **Multiple Fonts**: Default, serif, and monospace options

### **AI-Powered Writing**

- **Contextual Assistance**: Ask AI directly within any paragraph
- **Content Generation**: Generate, refine, and continue writing
- **Streaming Interface**: Real-time text generation with accept/discard options
- **Smart Integration**: AI suggestions respect existing formatting and context

### **Local-First Sync**

- **Instant Access**: All notes available offline with IndexedDB storage
- **Background Sync**: Automatic synchronization when online
- **Conflict Resolution**: Smart handling of concurrent edits
- **Operation Queue**: Reliable sync with retry mechanisms

### **Organization & Search**

- **Folder System**: Hierarchical organization with drag-and-drop
- **Fast Search**: Full-text search with word indexing
- **Favorites**: Quick access to important notes
- **Archive & Trash**: Clean workspace management

### **Export Capabilities**

- **Markdown Export**: Clean, portable markdown files
- **HTML Export**: Styled HTML with embedded CSS
- **Preserves Formatting**: All rich text features maintained

## 🏗️ Advanced Implementation Details

### **Custom Editor Architecture**

```typescript
// State management with transactions
class Transaction {
  constructor(private state: EditorState) {}
  add(step: Step): Transaction;
  apply(): EditorState;
}

// Extensible node system
type TextNode = HeadingNode | ParagraphNode | ListItemNode | BlockquoteNode;
```

The editor implements a **document-centric architecture** with:

- **Immutable State**: All changes through transactions
- **Operation Steps**: Composable, atomic operations
- **Smart Normalization**: Automatic content structure fixes
- **Selection Management**: Complex selection and range handling

### **Sync Engine**

Features:

- **Operation Queue**: Offline operations queued and synced
- **Last-Write-Wins**: Simple but effective conflict resolution
- **Incremental Sync**: Only sync changes since last pull
- **Transaction Safety**: All sync operations are transactional

### **Performance Optimizations**

- **React Compiler**: Using React's experimental compiler for optimization
- **Memoization**: Strategic memoization for complex editor components
- **Virtual Rendering**: Efficient rendering of large documents
- **Debounced Operations**: Smart batching of user actions

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ and pnpm
- PostgreSQL database
- Google AI API key (for AI features)

### **Setup**

```bash
# Clone and install
git clone [repository-url]
cd inscribe
pnpm install

# Database setup
pnpm db:generate
pnpm db:push

# Start development
pnpm dev
```

### **Environment Variables**

```bash
DATABASE_URL="postgresql://..."
GOOGLE_GENERATIVE_AI_API_KEY="your-api-key"
BETTER_AUTH_SECRET="your-secret-key"
```
