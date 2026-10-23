import { useMemo, useState } from "react";
import {
  DISTRICTS, DISTRICT_POS, GENRES, TECH, COLLECTIVE_TYPES, SPACE_TYPES,
  INITIAL_SPACES, INITIAL_COLLECTIVES, INITIAL_REVIEWS,
} from "./data.js";
import { filterSpaces, averageRating } from "./logic.js";

const PHASES = [
  { name: "Research", text: "We talk to collectives and owners to understand what makes a short-term space work." },
  { name: "Design", text: "We shape the two flows, the map and the review system with the people who will use them." },
  { name: "Pilot", text: "We open a first set of spaces in a few districts and learn from real bookings." },
];

function Stars({ value }) {
  return <span aria-label={`${value.toFixed(1)} out of 5`}>{"★".repeat(Math.round(value))}{"☆".repeat(5 - Math.round(value))}</span>;
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function Hero({ go }) {
  return (
    <section className="hero">
      <h1>Berlin is full of rooms nobody is using.</h1>
      <p>Zwischenraum connects collectives who need a space with owners whose space is empty for a few days, weeks or months.</p>
      <div className="actions">
        <button className="btn primary" onClick={() => go("need")}>Need a space?</button>
        <button className="btn" onClick={() => go("have")}>Have a space?</button>
        <button className="btn ghost" onClick={() => go("map")}>Browse the map</button>
      </div>
    </section>
  );
}

function CollectiveFlow({ onSubmit, done }) {
  const [f, setF] = useState({ name: "", type: COLLECTIVE_TYPES[0], district: "", budget: "", email: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <section className="panel">
      <h2>Tell us what your collective needs</h2>
      {done ? <p className="notice" role="status">Request sent. We will match you with spaces in your district and budget.</p> : (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); }}>
          <Field label="Collective name"><input required value={f.name} onChange={set("name")} /></Field>
          <Field label="Collective profile"><select value={f.type} onChange={set("type")}>{COLLECTIVE_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Preferred district"><select value={f.district} onChange={set("district")}><option value="">Anywhere in Berlin</option>{DISTRICTS.map((d) => <option key={d}>{d}</option>)}</select></Field>
          <Field label="Budget per day (€)"><input type="number" min="0" required value={f.budget} onChange={set("budget")} /></Field>
          <Field label="Contact email"><input type="email" required value={f.email} onChange={set("email")} /></Field>
          <button className="btn primary" type="submit">Send request</button>
        </form>
      )}
    </section>
  );
}

function OwnerFlow({ onSubmit, done }) {
  const [f, setF] = useState({ name: "", sqm: "", district: DISTRICTS[0], cost: "", type: SPACE_TYPES[0], windows: "", email: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <section className="panel">
      <h2>List your empty space</h2>
      {done ? <p className="notice" role="status">Space listed. It now appears on the map.</p> : (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...f, sqm: Number(f.sqm), cost: Number(f.cost) }); }}>
          <Field label="Space name"><input required value={f.name} onChange={set("name")} /></Field>
          <Field label="Space type"><select value={f.type} onChange={set("type")}>{SPACE_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Size (m²)"><input type="number" min="1" required value={f.sqm} onChange={set("sqm")} /></Field>
          <Field label="District"><select value={f.district} onChange={set("district")}>{DISTRICTS.map((d) => <option key={d}>{d}</option>)}</select></Field>
          <Field label="Cost per day (€)"><input type="number" min="0" required value={f.cost} onChange={set("cost")} /></Field>
          <Field label="Availability window"><input required placeholder="For example: weekends in November" value={f.windows} onChange={set("windows")} /></Field>
          <Field label="Contact email"><input type="email" required value={f.email} onChange={set("email")} /></Field>
          <button className="btn primary" type="submit">List my space</button>
        </form>
      )}
    </section>
  );
}

function Filters({ f, setF, count }) {
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <div className="filters" role="search" aria-label="Filter spaces">
      <Field label="District"><select value={f.district} onChange={set("district")}><option value="">All districts</option>{DISTRICTS.map((d) => <option key={d}>{d}</option>)}</select></Field>
      <Field label="Event genre"><select value={f.genre} onChange={set("genre")}><option value="">Any genre</option>{GENRES.map((g) => <option key={g}>{g}</option>)}</select></Field>
      <Field label="Power and technical needs"><select value={f.tech} onChange={set("tech")}><option value="">Any setup</option>{TECH.map((t) => <option key={t}>{t}</option>)}</select></Field>
      <Field label="Max cost per day (€)"><input type="number" min="0" value={f.maxCost} onChange={set("maxCost")} /></Field>
      <Field label="Min size (m²)"><input type="number" min="0" value={f.minSqm} onChange={set("minSqm")} /></Field>
      <button className="btn ghost" onClick={() => setF({ district: "", genre: "", tech: "", maxCost: "", minSqm: "" })}>Clear filters</button>
      <p className="count" aria-live="polite">{count} {count === 1 ? "space" : "spaces"} found</p>
    </div>
  );
}

function SpaceMap({ spaces, selected, onSelect }) {
  return (
    <svg className="map" viewBox="0 0 100 100" role="img" aria-label="Map of Berlin districts with available spaces">
      <path className="line" d="M10 40 L48 40 L68 42 L86 30" />
      <path className="line" d="M40 16 L48 40 L46 62 L56 82" />
      <path className="line" d="M46 62 L78 76" />
      {DISTRICTS.map((d) => (
        <text key={d} x={DISTRICT_POS[d][0]} y={DISTRICT_POS[d][1] + 7} className="dlabel" textAnchor="middle">{d}</text>
      ))}
      {spaces.map((s, i) => {
        const [x, y] = DISTRICT_POS[s.district];
        const cx = x + ((i % 3) - 1) * 4, cy = y - 2 + (i % 2) * 3;
        return (
          <g key={s.id} tabIndex="0" role="button" aria-label={`Select ${s.name}`} onClick={() => onSelect(s.id)}
             onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(s.id)}>
            <circle cx={cx} cy={cy} r={selected === s.id ? 3.4 : 2.4} className={selected === s.id ? "pin on" : "pin"} />
          </g>
        );
      })}
    </svg>
  );
}

function SpaceCard({ s, reviews, active, onRequest }) {
  const r = averageRating(reviews, "space", s.id);
  return (
    <article className={active ? "card active" : "card"}>
      <h3>{s.name}</h3>
      <p className="meta">{s.type}, {s.district}, {s.sqm} m², €{s.cost} per day</p>
      <p>Available: {s.windows}</p>
      <p>Genres: {s.genres.join(", ")}</p>
      <p>Technical: {s.tech.join(", ")}</p>
      <p className="rating">{r ? <><Stars value={r.avg} /> {r.avg.toFixed(1)} from {r.count} {r.count === 1 ? "review" : "reviews"}</> : "No reviews yet"}</p>
      <button className="btn" onClick={() => onRequest(s)}>Request this space</button>
    </article>
  );
}

function ReviewForm({ spaces, collectives, onAdd }) {
  const [role, setRole] = useState("Collective");
  const [target, setTarget] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const options = role === "Collective" ? spaces.map((s) => ({ v: String(s.id), l: s.name })) : collectives.map((c) => ({ v: c, l: c }));
  return (
    <section className="panel">
      <h2>Leave a review</h2>
      <p>Both sides review each other, so trust builds in both directions.</p>
      <form onSubmit={(e) => {
        e.preventDefault();
        onAdd({ targetType: role === "Collective" ? "space" : "collective", targetId: role === "Collective" ? Number(target) : target, role, author, rating: Number(rating), text });
        setText(""); setTarget(""); setAuthor("");
      }}>
        <Field label="I am reviewing as"><select value={role} onChange={(e) => { setRole(e.target.value); setTarget(""); }}><option value="Collective">A collective (reviewing a space)</option><option value="Owner">An owner (reviewing a collective)</option></select></Field>
        <Field label={role === "Collective" ? "Space" : "Collective"}><select required value={target} onChange={(e) => setTarget(e.target.value)}><option value="">Select…</option>{options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}</select></Field>
        <Field label="Your name"><input required value={author} onChange={(e) => setAuthor(e.target.value)} /></Field>
        <Field label="Rating"><select value={rating} onChange={(e) => setRating(e.target.value)}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} out of 5</option>)}</select></Field>
        <Field label="Your review"><textarea required rows="3" value={text} onChange={(e) => setText(e.target.value)} /></Field>
        <button className="btn primary" type="submit">Publish review</button>
      </form>
    </section>
  );
}

function ReviewList({ reviews, spaces }) {
  const name = (r) => (r.targetType === "space" ? spaces.find((s) => s.id === r.targetId)?.name : r.targetId);
  return (
    <section className="panel">
      <h2>Recent reviews</h2>
      {reviews.length === 0 ? <p>No reviews yet. Be the first to leave one.</p> : (
        <ul className="reviews">{[...reviews].reverse().map((r) => (
          <li key={r.id}><strong>{name(r)}</strong> <Stars value={r.rating} /><p>{r.text}</p><small>{r.author}, {r.role.toLowerCase()}</small></li>
        ))}</ul>
      )}
    </section>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [spaces, setSpaces] = useState(INITIAL_SPACES);
  const [collectives, setCollectives] = useState(INITIAL_COLLECTIVES);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [filters, setFilters] = useState({ district: "", genre: "", tech: "", maxCost: "", minSqm: "" });
  const [selected, setSelected] = useState(null);
  const [sent, setSent] = useState({ need: false, have: false });
  const [toast, setToast] = useState("");
  const visible = useMemo(() => filterSpaces(spaces, filters), [spaces, filters]);

  const go = (v) => { setView(v); window.scrollTo(0, 0); };
  const nav = [["home", "Home"], ["need", "Need a space?"], ["have", "Have a space?"], ["map", "Map"], ["reviews", "Reviews"]];

  return (
    <>
      <header className="bar">
        <button className="brand" onClick={() => go("home")}>Zwischenraum Berlin</button>
        <nav aria-label="Main">{nav.map(([k, l]) => <button key={k} aria-current={view === k ? "page" : undefined} onClick={() => go(k)}>{l}</button>)}</nav>
      </header>
      <main>
        {toast && <p className="notice" role="status">{toast}</p>}
        {view === "home" && (<>
          <Hero go={go} />
          <section className="phases"><h2>How we are building this</h2>
            <ol>{PHASES.map((p) => <li key={p.name}><h3>{p.name}</h3><p>{p.text}</p></li>)}</ol>
          </section>
        </>)}
        {view === "need" && <CollectiveFlow done={sent.need} onSubmit={(f) => { setCollectives([...collectives, f.name]); setSent({ ...sent, need: true }); }} />}
        {view === "have" && <OwnerFlow done={sent.have} onSubmit={(f) => {
          setSpaces([...spaces, { ...f, id: Date.now(), genres: GENRES.slice(0, 2), tech: ["Standard sockets"] }]);
          setSent({ ...sent, have: true });
        }} />}
        {view === "map" && (
          <section className="mapview">
            <h2>Available spaces</h2>
            <Filters f={filters} setF={setFilters} count={visible.length} />
            <div className="split">
              <SpaceMap spaces={visible} selected={selected} onSelect={setSelected} />
              <div className="list">
                {visible.length === 0 && <p>No spaces match these filters. Try a larger budget or a different district.</p>}
                {visible.map((s) => <SpaceCard key={s.id} s={s} reviews={reviews} active={selected === s.id}
                  onRequest={(sp) => { setToast(`Request sent for “${sp.name}”. The owner will reply by email.`); setTimeout(() => setToast(""), 4000); }} />)}
              </div>
            </div>
          </section>
        )}
        {view === "reviews" && (<><ReviewForm spaces={spaces} collectives={collectives}
          onAdd={(r) => setReviews([...reviews, { ...r, id: Date.now() }])} /><ReviewList reviews={reviews} spaces={spaces} /></>)}
      </main>
      <footer>Zwischenraum Berlin. Research, design and pilot in progress.</footer>
    </>
  );
}
