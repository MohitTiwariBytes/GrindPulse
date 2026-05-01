# GrindPulse

A clean, minimal Pomodoro-style focus timer with streak tracking and session history. No accounts, no backend — everything lives in your browser.

## Features

- **Focus Timer** — 25-minute work sessions with 5-minute break mode
- **Task Tracking** — name each session before you start; editing locks while the timer runs
- **Streak System** — daily streak increments on consecutive days, resets on any missed day
- **Session History** — every completed session is saved with task name, duration, and timestamp
- **Stats Dashboard** — total sessions, total focus time, current streak, and best streak
- **Dark / Light Mode** — toggle with one click, preference persisted across visits
- **Sound Alert** — short beep via Web Audio API when a session ends
- **Fully Offline** — no backend, no auth; all data stored in `localStorage`

## How It Works

1. Type what you're working on in the task field
2. Click **Start** — the 25-minute countdown begins and the ring depletes
3. When time runs out you'll hear a beep and see "Session Complete!"
4. Your session is logged and your streak updates automatically
5. Switch to **Break** for a 5-minute rest, then repeat

### Streak Logic

| Scenario | Result |
|---|---|
| Completed a session today (already counted) | Streak unchanged |
| Completed yesterday → session today | Streak + 1 |
| Missed one or more days | Streak resets to 1 |

## Tech Stack

| Layer | Choice |
|---|---|
| UI | React 19 |
| Bundler | Vite 8 |
| Styling | Plain CSS with CSS custom properties |
| Persistence | `localStorage` |
| Audio | Web Audio API (no files) |
| Libraries | Zero runtime dependencies beyond React |

## Project Structure

```
src/
├── components/
│   ├── Timer.jsx        # Countdown ring + controls
│   ├── TaskInput.jsx    # Task name field
│   ├── SessionList.jsx  # Past sessions (newest first)
│   └── Stats.jsx        # Stats dashboard (4 cards)
├── utils/
│   ├── storage.js       # localStorage read/write helpers
│   └── streak.js        # Streak calculation logic
├── App.jsx              # Root component, all shared state
├── App.css              # All component styles + theming tokens
└── index.css            # CSS reset
```

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Production Build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

## Deploy on Vercel

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your repository — Vercel auto-detects Vite
4. Click **Deploy** — done

Your app will be live at `https://your-project.vercel.app`

## Live Demo

[Add your Vercel URL here after deploying]

---

Built with React + Vite. No AI slop. No overengineering.
