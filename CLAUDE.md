# Personal OS SuperApp - AI Development Guidelines

This file serves as a reference for AI agents working on this repository to ensure strict adherence to the project's unique architecture and styling constraints.

## 🛠️ Build Commands
- **Development Server:** `npm run dev`
- **Build Production:** `npm run build`
- **Linting:** `npm run lint`

## 📂 Architecture Rules
This is a single-page application built on Next.js 15 App Router that functions as an "Operating System".
- **Strict Modularity:** Code must be placed in its specific domain folder within `src/components/`. 
  - `core/`: Layout, navigation, overarching app shell.
  - `hubs/`: The high-level dashboard containers (Trading, Finance, Productivity, etc).
  - `trading/`: Specific modules explicitly for trading logic (Trade Journal, Sizer).
  - `ui/`: Generic reusable components (Shadcn UI).
- **No Page Reloads:** Use the Hub architecture and Zustand (`src/store/appStore.ts`) to toggle the active view. The app renders a single `page.tsx` that hosts the `AppShell`.

## 🎨 Theme & UI Rules
**CRITICAL: Do not deviate from these visual constraints.**
1. **Deep Black & White Aesthetic:** The app uses absolute `#000000` backgrounds and `#ffffff` accents.
2. **No Glassmorphism:** Avoid `backdrop-blur` or semi-transparent gradient overlays. Keep it flat and raw.
3. **No Generic Colors:** Do NOT use standard `bg-blue-500`, `bg-red-500`, etc. The only exceptions are specific financial indicators (e.g., `text-green-400` for profits, `text-red-400` for losses or high-risk tags).
4. **Sharp Edges:** Use an 8px border radius (`rounded-md` or `rounded-lg`) on all cards, buttons, and inputs.
5. **Command Center Typography:** Use uppercase, heavily tracked fonts for headers (e.g., `uppercase tracking-widest font-bold`).

## 🧠 Philosophy
- **Execution Focused:** This app is meant to enforce discipline, not waste time. Avoid building social feeds, endless scrolling news, or complex visualizations unless strictly tied to a user workflow.
- **Zero Bloat:** If a feature isn't directly actionable (like logging a decision, timing a pomodoro, or calculating risk), ask before building it.
