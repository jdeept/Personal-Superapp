# Personal OS SuperApp

The Personal OS SuperApp is a modular, unified dashboard built to streamline daily operations across trading, finance, productivity, and knowledge management. It was built with an execution-focused philosophy, avoiding code bloat and unnecessary features.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI (Custom Deep Black & White Theme)
- **State Management:** Zustand (Modular Hub Routing)
- **Database:** MongoDB (via Mongoose)
- **Charts:** Recharts
- **CSV Parsing:** PapaParse

## 📂 Architecture & Directory Structure

To avoid code bloat, components are strictly organized into logical domains:

```text
src/
├── app/                  # Next.js App Router (layout, page)
├── components/           # UI Components
│   ├── core/             # Foundational layout (AppShell, Sidebar, CommandCenter, PreMarketGuard)
│   ├── hubs/             # The main OS Hubs (Trading, Finance, Productivity, Decision, Analytics, Knowledge)
│   ├── trading/          # Trading-specific modules (PreFlightRiskMatrix, TradeJournal, CsvImport, TradingAnalytics)
│   └── ui/               # Generic Shadcn UI components (Card, Button, Table, Checkbox, etc.)
├── lib/                  # Utilities (MongoDB connection, Tailwind utils)
└── store/                # Global State Management (Zustand: appStore.ts)
```

## 🧠 Core Features

### 1. The Pre-Market Guard
A mandatory modal checklist that enforces discipline before you even enter the app.

### 2. The Hub Switcher (AppShell)
A fixed sidebar that acts as the backbone of the OS, instantly switching views via Zustand state (no full page reloads).

### 3. Execution Hubs
- **Trading Hub:** Includes a Pre-Flight Risk Matrix (Position Sizer), PapaParse CSV Importer, Trade Journal with psychological tagging, and Recharts equity curves.
- **Finance Hub:** Net worth tracking, liquid cash, and 6-month trajectory mapping.
- **Productivity Hub:** Pomodoro focus timer and daily habit tracking (with dynamic completion rates).
- **Decision Hub:** Decision journals, risk matrices, and an idea inbox.
- **Analytics Hub:** Cross-referencing logic (e.g., Habits vs. Trading P&L).
- **Knowledge Hub:** A "second brain" file system for playbooks and research notes.

## 🛠️ Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your environment variables:**
   Create a `.env.local` file in the root directory and add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/personal_os
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the OS.

## 🎨 Theme Guidelines
The UI adheres strictly to a high-contrast, premium "Deep Black & White" aesthetic.
- No generic colors (reds/greens only used intentionally for P&L or alerts).
- No glassmorphism.
- 8px border-radius on all interactive elements.
- Heavy use of uppercase, tracking-widest typography for headers to evoke a "Command Center" feel.
