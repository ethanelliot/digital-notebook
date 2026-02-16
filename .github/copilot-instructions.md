# Copilot instructions for this repository

## Quick commands
- Dev server: `npm run dev` (runs: `vite --host`)
- Build (production): `npm run build` (runs: `tsc -b && vite build`) — note: runs TypeScript project build first
- Preview production build: `npm run preview` (runs: `vite preview`)
- Lint: `npm run lint` (runs: `eslint .`)
- Fix lint issues: `npm run lint:fix` (runs: `eslint . --fix`)
- Formatting: `npm run format` (runs: `prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}"`)
- Formatting check: `npm run format:check` (runs: `prettier --check "src/**/*.{ts,tsx,js,jsx,json,css,md}"`)

> Tests: No test scripts or test runner configured in package.json.

## Environment variables
The app uses Firebase. Set these Vite env vars (used in `src/firebase.ts`) when running the app locally or in CI:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## High-level architecture
- Entry point: `src/main.tsx` — sets up routing and top-level providers:
  - `AuthProvider` (`src/contexts/auth-context.tsx`)
  - `ThemeProvider` (`src/components/theme-provider.tsx`)
  - `WorkspaceProvider` (`src/contexts/workspace-context.tsx`)
  - `DialogProvider` (`src/contexts/dialog-context.tsx`)
- Routing: protected root uses `DashboardLayout` (`src/components/dashboard/*`) with children pages (Home, Notes, Calendar, Groups, Settings). The editor route is `/notebook/:notebookId` and renders `EditorPage` (`src/pages/editor-page.tsx`).
- Data layer: Firestore is the primary datastore (initialized in `src/firebase.ts`). Realtime listeners and CRUD helpers are in `src/hooks/use-workspace-data.tsx`; collections used include `groups`, `notes`, and `notebooks`.
- Notebook content: Editor content is stored as Tiptap `JSONContent` at `notebooks/{notebookId}/content/main` (see `use-notebook-content.tsx`).
- Editor: Tiptap-based editor with TaskList and custom TaskItem node views (`src/components/editor/*`). The editor UI and debounced saves are implemented in `src/components/editor/editor.tsx`.
- UI & styling: Tailwind CSS + `@tailwindcss/vite` plugin; Radix UI primitives and `lucide-react` icons; shared UI building blocks live under `src/components/ui`.
- Build: `npm run build` runs `tsc -b` first (TypeScript project references) then `vite build`.

## Key conventions (important for Copilot)
- Import alias: `@` maps to `src/` (configured in `tsconfig.*` and `vite.config.ts`). Use `@/path/to` for internal imports.
- Runtime import extensions: Source files often import other local modules with a `.js` extension even when the files are `.ts`/`.tsx` (e.g. `import './components/auth/protected-route.js'`). This is intentional to match ESM runtime resolution; `tsconfig.app.json` has `allowImportingTsExtensions`/`verbatimModuleSyntax` to support this. Preserve the `.js` suffix in imports.
- Context consumption: This codebase consistently uses `use` from React for context consumption (e.g. `import { createContext, use } from 'react'` then `use(MyContext)`) instead of `useContext`. Follow that pattern.
- Firestore shape: Use the helpers in `src/hooks/*` for consistent reads/writes. When creating a notebook the code creates an initial document at `content/main` (a `doc` with a paragraph) — keep that shape when producing or migrating data.
- Linting: ESLint is configured for type-aware rules (`eslint.config.js`) and points to `tsconfig.app.json`/`tsconfig.node.json`. Running `npm run lint` assumes those tsconfig files exist.
- PWA & hosting: `vite.config.ts` configures `VitePWA`; `firebase.json` expects the production output in `dist` and rewrites all routes to `index.html` for client-side routing.

## Where to look quickly
- Routing & providers: `src/main.tsx`
- Auth: `src/contexts/auth-context.tsx` and `src/firebase.ts`
- Workspace & realtime data: `src/hooks/use-workspace-data.tsx` and `src/contexts/workspace-context.tsx`
- Editor: `src/components/editor/*` and `src/hooks/use-notebook-content.tsx`
- Layout & UI primitives: `src/components/dashboard/*` and `src/components/ui`
- Small helpers: `src/lib/*`

## AI assistant / other configs
- No additional assistant configuration files (CLAUDE.md, AGENTS.md, .cursorrules, .windsurfrules, etc.) were found in the repository root.

## Notes from README
- The README suggests enabling type-aware ESLint rules; `eslint.config.js` in this repo already references `tsconfig.*` for that purpose — follow the README guidance if changing lint rules.

---

This file is intended to help future Copilot sessions quickly understand build/run commands, the app structure, and repository-specific conventions.
