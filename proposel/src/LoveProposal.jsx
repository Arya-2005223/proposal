import { useState, useRef, useEffect } from "react";
// ---------------------------------------------------------------------------
// Concept: a wax-sealed love letter arriving at night, in a garden of
// falling petals and fireflies. The person breaks the seal, and the letter
// unfolds one question at a time. No pink-hearts-on-white — this is ink,
// wax, gold leaf, and candlelight.
//
// Tokens
// ink      #1c0f16   the night, base background
// plum     #3a1a2c   panel / mid depth
// parchment#f4e9d8   the letter paper itself
// ink-text #34202a   text written on the parchment
// gold     #c9a15a   wax / gold leaf accent
// wine     #8a2846   the wax seal itself
// blush    #e8b8c2   script accent on dark backgrounds
// ---------------------------------------------------------------------------

const TOTAL_STEPS = 5;
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// ---- ambient background: falling petals + fireflies ------------------

function usePetals(count = 16) {
  const [petals] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 16,
      duration: 12 + Math.random() * 10,
      size: 8 + Math.random() * 10,
      drift: (Math.random() - 0.5) * 140,
      spin: 180 + Math.random() * 360,
      hue: Math.random() > 0.5 ? "petal-gold" : "petal-rose",
    }))
  );
  return petals;
}

function useFireflies(count = 10) {
  const [flies] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      top: 10 + Math.random() * 75,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 3,
    }))
  );
  return flies;
}

function Petal({ p }) {
  return (
    <span
      className={`petal ${p.hue}`}
      style={{
        left: `${p.left}%`,
        width: p.size,
        height: p.size * 0.8,
        animationDelay: `${p.delay}s`,
        animationDuration: `${p.duration}s`,
        "--drift": `${p.drift}px`,
        "--spin": `${p.spin}deg`,
      }}
    />
  );
}

function Firefly({ f }) {
  return (
    <span
      className="firefly"
      style={{
        top: `${f.top}%`,
        left: `${f.left}%`,
        animationDelay: `${f.delay}s`,
        animationDuration: `${f.duration}s`,
      }}
    />
  );
}

function ProgressDots({ step }) {
  return (
    <div className="progress" aria-hidden="true">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <span key={i} className={`dot ${i <= step ? "dot-lit" : ""}`} />
      ))}
    </div>
  );
}

function DisabledNo({ label = "no" }) {
  const [shake, setShake] = useState(false);
  return (
    <button
      type="button"
      className={`choice choice-no ${shake ? "shake" : ""}`}
      aria-disabled="true"
      title="that word doesn't live in this letter"
      onClick={() => {
        setShake(true);
        setTimeout(() => setShake(false), 450);
      }}
    >
      {label}
    </button>
  );
}

// ---- Calendar ----------------------------------------------------------

function Calendar({ selected, onSelect }) {
  const today = startOfToday();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  const isPast = (day) => new Date(year, month, day) < today;
  const isSelected = (day) =>
    selected &&
    selected.getFullYear() === year &&
    selected.getMonth() === month &&
    selected.getDate() === day;

  const canGoBack = new Date(year, month, 1) > new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div className="calendar">
      <div className="cal-header">
        <button type="button" className="cal-nav" disabled={!canGoBack}
          onClick={() => setViewDate(new Date(year, month - 1, 1))} aria-label="Previous month">‹</button>
        <span className="cal-title">{MONTH_NAMES[month]} {year}</span>
        <button type="button" className="cal-nav"
          onClick={() => setViewDate(new Date(year, month + 1, 1))} aria-label="Next month">›</button>
      </div>
      <div className="cal-grid cal-weekdays">
        {WEEKDAY_LABELS.map((w, i) => <span key={i} className="cal-weekday">{w}</span>)}
      </div>
      <div className="cal-grid">
        {cells.map((day, i) =>
          day === null ? (
            <span key={i} className="cal-cell cal-empty" />
          ) : (
            <button type="button" key={i}
              className={`cal-cell cal-day ${isSelected(day) ? "cal-selected" : ""}`}
              disabled={isPast(day)}
              onClick={() => onSelect(new Date(year, month, day))}>
              {day}
            </button>
          )
        )}
      </div>
    </div>
  );
}

// ---- Wax seal / envelope intro ------------------------------------------

function Envelope({ state, onBreakSeal }) {
  return (
    <div className={`envelope-wrap env-${state}`}>
      <div className="envelope">
        <div className="env-body" />
        <div className="env-flap" />
        <button
          type="button"
          className="wax-seal"
          onClick={onBreakSeal}
          disabled={state !== "closed"}
          aria-label="Break the wax seal to open the letter"
        >
          <svg viewBox="0 0 60 60" width="52" height="52">
            <circle cx="30" cy="30" r="27" fill="url(#waxGrad)" stroke="#5c1730" strokeWidth="1.5" />
            <path d="M30 16c4 5 9 6 9 12a9 9 0 1 1-18 0c0-6 5-7 9-12z"
              fill="none" stroke="#e9c68c" strokeWidth="1.6" opacity="0.85" />
            <defs>
              <radialGradient id="waxGrad" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#b23a56" />
                <stop offset="55%" stopColor="#8a2846" />
                <stop offset="100%" stopColor="#5c1730" />
              </radialGradient>
            </defs>
          </svg>
        </button>
      </div>
      <p className="env-caption">
        {state === "closed" ? "A letter has arrived — press the seal to open it" : ""}
      </p>
    </div>
  );
}

// ---- Ornamental corner flourish ------------------------------------------

function Flourish({ className }) {
  return (
    <svg className={className} viewBox="0 0 60 60" width="34" height="34" aria-hidden="true">
      <path d="M4 4 C 20 4, 4 20, 4 4 Z M4 4 C 4 24, 30 4, 4 4 Z"
        fill="none" stroke="#c9a15a" strokeWidth="1.1" opacity="0.7" />
      <circle cx="4" cy="4" r="2" fill="#c9a15a" opacity="0.8" />
    </svg>
  );
}

// ---- Main app -------------------------------------------------------------

export default function LoveProposal() {
  const [envState, setEnvState] = useState("closed"); // closed | opening | opened
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [date, setDate] = useState(null);
  const [location, setLocation] = useState("");
  const petals = usePetals();
  const fireflies = useFireflies();
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (envState === "opened" && step === 0 && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [envState, step]);

  const breakSeal = () => {
    if (envState !== "closed") return;
    setEnvState("opening");
    setTimeout(() => setEnvState("opened"), 950);
  };

  const goTo = (n) => setStep(n);
  const firstName = name.trim().split(/\s+/)[0] || "";
  const displayName = name.trim() || "you";
  const formattedDate = date
    ? date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "";

  // Save the completed proposal reply to the backend/MongoDB.
  const submitProposal = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          question1: q1,
          question2: q2,
          date: formattedDate,
          location: location.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save reply");
      }

      console.log("Saved to MongoDB:", data);
      alert("Your reply has been saved ❤️");
      return true;
    } catch (error) {
      console.error("MongoDB save error:", error);
      alert("Failed to save reply ❌\n\nMake sure your backend and MongoDB are running.");
      return false;
    }
  };

  return (
    <div className="stage">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .stage {
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(ellipse 70% 45% at 20% 90%, rgba(138,40,70,0.18), transparent 60%),
            radial-gradient(ellipse 120% 90% at 50% -10%, #3a1a2c 0%, #1c0f16 55%, #100810 100%);
          font-family: 'Jost', sans-serif;
          color: #f4e9d8;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 18px;
        }

        .script { font-family: 'Great Vibes', cursive; color: #e8b8c2; font-size: 1.35em; line-height: 1; }

        /* ---- ambient petals + fireflies ---- */
        .petal {
          position: absolute;
          top: -14px;
          border-radius: 60% 0 60% 0;
          opacity: 0;
          animation-name: petal-fall;
          animation-timing-function: ease-in;
          animation-iteration-count: infinite;
          pointer-events: none;
          z-index: 1;
        }
        .petal-gold { background: linear-gradient(135deg, #e9c68c, #c9a15a); }
        .petal-rose { background: linear-gradient(135deg, #e8b8c2, #b2596c); }
        @keyframes petal-fall {
          0%   { opacity: 0; transform: translate(0,0) rotate(0deg); }
          10%  { opacity: 0.9; }
          85%  { opacity: 0.6; }
          100% { opacity: 0; transform: translate(var(--drift), 108vh) rotate(var(--spin)); }
        }

        .firefly {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #e9c68c;
          box-shadow: 0 0 6px 2px rgba(233,198,140,0.8);
          animation-name: firefly-glow;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes firefly-glow {
          0%, 100% { opacity: 0.15; transform: translateY(0); }
          50% { opacity: 0.9; transform: translateY(-10px); }
        }

        /* ---- envelope intro ---- */
        .envelope-wrap {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
          transition: opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s;
        }
        .env-opened { opacity: 0; transform: scale(0.92); pointer-events: none; position: absolute; }

        .envelope {
          position: relative;
          width: 220px;
          height: 140px;
        }
        .env-body {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, #4a2035, #2a1420);
          border: 1px solid rgba(201,161,90,0.35);
          border-radius: 6px;
        }
        .env-flap {
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          height: 76px;
          background: linear-gradient(200deg, #5c2840, #331a28);
          clip-path: polygon(0 0, 100% 0, 50% 82%);
          border-radius: 6px 6px 0 0;
          transform-origin: top center;
          transform: rotateX(0deg);
          transition: transform 0.9s cubic-bezier(.6,-0.28,.35,1.4);
        }
        .env-opening .env-flap, .env-opened .env-flap { transform: rotateX(-170deg); }
        .wax-seal {
          position: absolute;
          top: 46px;
          left: 50%;
          transform: translateX(-50%);
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
          animation: seal-pulse 2.6s ease-in-out infinite;
        }
        .wax-seal:disabled { cursor: default; animation: none; }
        .env-opening .wax-seal, .env-opened .wax-seal { opacity: 0; transform: translateX(-50%) scale(0.4) rotate(25deg); transition: opacity 0.4s ease, transform 0.4s ease; }
        @keyframes seal-pulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.05); }
        }
        .env-caption {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          color: #cbb3a8;
          font-size: 15px;
          text-align: center;
        }

        /* ---- letter card ---- */
        .letter {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 460px;
          background: #f4e9d8;
          color: #34202a;
          border-radius: 4px;
          padding: 46px 36px 34px;
          box-shadow: 0 40px 80px -25px rgba(0,0,0,0.65), 0 0 0 1px rgba(201,161,90,0.25);
          opacity: 0;
          transform: translateY(24px) scale(0.97);
          transition: opacity 0.7s ease, transform 0.7s ease;
          position: absolute;
          pointer-events: none;
        }
        .letter::before {
          content: "";
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(138,40,70,0.18);
          pointer-events: none;
        }
        .env-opened + .letter,
        .letter.letter-visible {
          position: relative;
          opacity: 1;
          transform: translateY(0) scale(1);
          transition-delay: 0.5s;
          pointer-events: auto;
        }
        .flourish-tl { position: absolute; top: 10px; left: 10px; }
        .flourish-br { position: absolute; bottom: 10px; right: 10px; transform: rotate(180deg); }

        .progress { display: flex; justify-content: center; gap: 8px; margin-bottom: 26px; }
        .dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(138,40,70,0.22); transition: background 0.4s ease, transform 0.4s ease; }
        .dot-lit { background: #8a2846; transform: scale(1.3); }

        .panel { animation: fadeSlide 0.55s ease both; }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .eyebrow {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 15px;
          color: #8a2846;
          margin: 0 0 8px;
          text-align: center;
        }
        h1.headline {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: 27px;
          line-height: 1.35;
          margin: 0 0 24px;
          text-align: center;
          color: #34202a;
        }

        .field-label { display: block; font-size: 12.5px; color: #6e4c56; margin-bottom: 7px; letter-spacing: 0.01em; }

        input[type="text"] {
          width: 100%;
          background: rgba(138,40,70,0.05);
          border: none;
          border-bottom: 1.5px solid rgba(138,40,70,0.35);
          border-radius: 0;
          padding: 10px 4px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 19px;
          color: #34202a;
          outline: none;
          transition: border-color 0.25s ease;
        }
        input[type="text"]::placeholder { color: #a98a90; font-style: italic; }
        input[type="text"]:focus { border-color: #8a2846; }

        .btn-primary {
          margin-top: 26px;
          width: 100%;
          font-family: 'Jost', sans-serif;
          font-weight: 500;
          font-size: 14px;
          letter-spacing: 0.03em;
          padding: 13px 18px;
          background: linear-gradient(135deg, #c9a15a, #a5793c);
          color: #241016;
          border: none;
          clip-path: polygon(3% 0, 97% 0, 100% 50%, 97% 100%, 3% 100%, 0 50%);
          cursor: pointer;
          transition: filter 0.2s ease, transform 0.15s ease;
        }
        .btn-primary:hover:not(:disabled) { filter: brightness(1.08); }
        .btn-primary:active:not(:disabled) { transform: scale(0.98); }
        .btn-primary:disabled { opacity: 0.3; cursor: not-allowed; }

        .choices { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
        .choice {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          padding: 12px 16px;
          border-radius: 3px;
          border: 1px solid rgba(138,40,70,0.4);
          background: transparent;
          color: #34202a;
          cursor: pointer;
          text-align: center;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
        }
        .choice:hover { background: rgba(138,40,70,0.08); border-color: #8a2846; }
        .choice:active { transform: scale(0.98); }
        .choice-no {
          color: #a98a90;
          border-color: rgba(169,138,144,0.35);
          text-decoration: line-through;
          cursor: not-allowed;
          font-style: italic;
        }
        .choice-no:hover { background: transparent; border-color: rgba(169,138,144,0.5); }
        .shake { animation: shake 0.42s ease; }
        @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        .hint { font-size: 12px; color: #a98a90; margin-top: 10px; text-align: center; font-style: italic; font-family: 'Cormorant Garamond', serif; }

        /* calendar */
        .calendar { margin-top: 6px; border: 1px solid rgba(138,40,70,0.22); border-radius: 6px; padding: 16px; }
        .cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .cal-title { font-family: 'Cormorant Garamond', serif; font-size: 18px; color: #8a2846; font-style: italic; }
        .cal-nav { background: none; border: 1px solid rgba(138,40,70,0.35); color: #8a2846; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-size: 15px; line-height: 1; }
        .cal-nav:disabled { opacity: 0.25; cursor: not-allowed; }
        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
        .cal-weekdays { margin-bottom: 4px; }
        .cal-weekday { text-align: center; font-size: 11px; color: #a98a90; }
        .cal-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 13px; font-family: 'Jost', sans-serif; }
        .cal-empty { background: transparent; border: none; }
        .cal-day { background: transparent; border: 1px solid transparent; border-radius: 4px; color: #34202a; cursor: pointer; }
        .cal-day:hover:not(:disabled) { border-color: rgba(138,40,70,0.5); }
        .cal-day:disabled { color: #d8c8bd; cursor: not-allowed; }
        .cal-selected { background: #8a2846 !important; color: #f4e9d8 !important; font-weight: 600; border-color: #8a2846 !important; }

        .summary-line { font-size: 13.5px; color: #6e4c56; margin-top: 10px; text-align: center; font-style: italic; font-family: 'Cormorant Garamond', serif; }
        .summary-value { color: #8a2846; font-weight: 600; font-style: normal; }

        /* final invitation */
        .final { text-align: center; }
        .final .headline { font-size: 30px; }
        .bloom-wrap { display: flex; justify-content: center; margin: 6px 0 18px; }
        .final-detail {
          margin-top: 6px;
          padding: 18px;
          border: 1px solid rgba(138,40,70,0.25);
          border-radius: 4px;
          background: rgba(138,40,70,0.045);
          text-align: left;
        }
        .final-detail p { margin: 5px 0; font-size: 14px; color: #6e4c56; font-family: 'Jost', sans-serif; }
        .final-detail strong { color: #34202a; font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 600; }
        .signoff { margin-top: 18px; font-family: 'Great Vibes', cursive; font-size: 26px; color: #8a2846; }
      `}</style>

      {petals.map((p) => <Petal key={p.id} p={p} />)}
      {fireflies.map((f) => <Firefly key={f.id} f={f} />)}

      <Envelope state={envState} onBreakSeal={breakSeal} />

      <div className={`letter ${envState === "opened" ? "letter-visible" : ""}`}>
        <Flourish className="flourish-tl" />
        <Flourish className="flourish-br" />
        <ProgressDots step={step} />

        {step === 0 && (
          <div className="panel" key="step0">
            <p className="eyebrow">a small question, on paper</p>
            <h1 className="headline">
              Before I ask you anything, tell me <span className="script">who</span> I'm writing to.
            </h1>
            <label className="field-label" htmlFor="name-input">Your full name</label>
            <input id="name-input" type="text" ref={nameInputRef} value={name}
              onChange={(e) => setName(e.target.value)} placeholder="e.g. Arya Samanta"
              onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) goTo(1); }} />
            <button type="button" className="btn-primary" disabled={!name.trim()} onClick={() => goTo(1)}>
              Continue
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="panel" key="step1">
            <p className="eyebrow">question one</p>
            <h1 className="headline">
              Dear {displayName}, do you <span className="script">like</span> me? 🥺
            </h1>
            <div className="choices">
              <button className="choice" onClick={() => { setQ1("Yes ❤️"); goTo(2); }}>Yes ❤️</button>
              <button className="choice" onClick={() => { setQ1("Of course! 😍"); goTo(2); }}>Of course! 😍</button>
              <DisabledNo />
            </div>
            <p className="hint">that word was never printed on this page</p>
          </div>
        )}

        {step === 2 && (
          <div className="panel" key="step2">
            <p className="eyebrow">question two</p>
            <h1 className="headline">
              Then, {firstName || "you"}, will you go on a <span className="script">date</span> with me? 🌹
            </h1>
            <div className="choices">
              <button className="choice" onClick={() => { setQ2("Yes 💖"); goTo(3); }}>Yes 💖</button>
              <button className="choice" onClick={() => { setQ2("Maybe 🙈"); goTo(3); }}>Maybe 🙈</button>
              <DisabledNo />
            </div>
            <p className="hint">still not an option in this letter</p>
          </div>
        )}

        {step === 3 && (
          <div className="panel" key="step3">
            <p className="eyebrow">pick a day</p>
            <h1 className="headline">
              <span className="script">When</span> should I come find you, {firstName || "you"}?
            </h1>
            <Calendar selected={date} onSelect={(d) => setDate(d)} />
            {date && <p className="summary-line">You chose <span className="summary-value">{formattedDate}</span></p>}
            <button type="button" className="btn-primary" disabled={!date} onClick={() => goTo(4)}>Continue</button>
          </div>
        )}

        {step === 4 && (
          <div className="panel" key="step4">
            <p className="eyebrow">pick a place</p>
            <h1 className="headline">
              And <span className="script">where</span> should this all happen?
            </h1>
            <label className="field-label" htmlFor="location-input">The place</label>
            <input id="location-input" type="text" value={location}
              onChange={(e) => setLocation(e.target.value)} placeholder="that little café downtown, maybe?"
              onKeyDown={(e) => { if (e.key === "Enter" && location.trim()) goTo(5); }} />
            <button
              type="button"
              className="btn-primary"
              disabled={!location.trim()}
              onClick={async () => {
                const saved = await submitProposal();
                if (saved) {
                  goTo(5);
                }
              }}
            >
              Seal it with a kiss
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="panel final" key="step5">
            <p className="eyebrow">it's settled</p>
            <h1 className="headline">
              It's a date, <span className="script">{displayName}</span>. 💌
            </h1>
            <div className="bloom-wrap">
              <svg width="72" height="72" viewBox="0 0 72 72">
                <g fill="#8a2846">
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <ellipse key={i} cx="36" cy="20" rx="9" ry="15"
                      transform={`rotate(${deg} 36 36)`} opacity="0.85" />
                  ))}
                </g>
                <circle cx="36" cy="36" r="7" fill="#c9a15a" />
              </svg>
            </div>
            <div className="final-detail">
              <p><strong>When:</strong> {formattedDate}</p>
              <p><strong>Where:</strong> {location}</p>
              <p><strong>You said:</strong> {q1}, then {q2}</p>
            </div>
            <p className="signoff">until then</p>
          </div>
        )}
      </div>
    </div>
  );
}
