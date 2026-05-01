# GrindPulse

This is a simple focus timer I built to help you actually sit down and get work done.

No accounts. No syncing. No “sign up to continue” nonsense.
Everything stays in your browser. You open it, you use it, that’s it.

---

## what you can do with it

You get a clean 25-minute focus timer with a short break mode. Nothing fancy, just what works.

You can name what you’re working on before you start. Once the timer is running, it locks so you don’t keep changing your task mid-session.

It tracks your streak too. If you show up every day, it grows. Miss a day, it resets. Simple and a bit painful… which is the point.

Every time you finish a session, it gets saved. You can look back and see what you worked on, how long you focused, and when you did it.

There’s also a small stats section so you can quickly check:

* how many sessions you’ve done
* how much total time you’ve focused
* your current streak
* your best streak

You can switch between dark and light mode anytime. It remembers your choice.

When a session ends, it plays a short beep. No audio files, just a quick sound so you know you're done.

And yeah, ts works offline No backend No login, Just localStorage :)


---

## How the streak system works

It’s strict on purpose.

If you already completed a session today, nothing changes.

If you worked yesterday and then again today, your streak goes up by one.

If you skip even one day, it resets back to 1.

No excuses built in.

---

## tech stackk

* React for the UI
* Vite to run it
* plain CSS for styling
* localStorage for saving data
* Web Audio API for the beep

No extra libraries doing magic in the background.

---

## project structure (quick look)

```
src/
  components/
    Timer.jsx
    TaskInput.jsx
    SessionList.jsx
    Stats.jsx
  utils/
    storage.js
    streak.js
  App.jsx
  App.css
  index.css
```

---

## run it locally

```
npm install
npm run dev
```

then open
[http://localhost:5173](http://localhost:5173)

---

## build for production

```
npm run build
npm run preview
```

---

## live demo

[See it livee -> ](https://grind-pulse.vercel.app/)
---

Thanksss!
