import { useState } from 'react'
import { Provider, useStore } from './store'
import MapView from './MapView'
import { HOODS, TYPES, GENRES } from './data'

const STATUS = { pending: 'in attesa', accepted: 'accettata', rejected: 'rifiutata', completed: 'conclusa' }
const rate = (v) => (v ? `${v.avg.toFixed(1)}/5 (${v.n})` : 'nessuna recensione')
const dow = (d) => new Date(d + 'T00:00:00Z').getUTCDay()
const wlabel = (w) => `${w.from} – ${w.to}${w.weekend ? ' (solo weekend)' : ''}`
// La data deve stare in una finestra libera e non coincidere con una richiesta già accettata.
const fits = (sp, d, rq) =>
  !!d &&
  sp.windows.some((w) => d >= w.from && d <= w.to && (!w.weekend || [0, 6].includes(dow(d)))) &&
  !rq.some((r) => r.spaceId === sp.id && r.date === d && r.status === 'accepted')

const F = ({ l, children }) => <label className="f"><span>{l}</span>{children}</label>

function ReviewForm({ labels, onSubmit }) {
  const [c, setC] = useState([5, 5, 5]), [t, setT] = useState('')
  return (
    <div className="void pad">
      {labels.map((l, i) => (
        <F key={l} l={l}>
          <select value={c[i]} onChange={(e) => setC(c.map((x, j) => (j === i ? +e.target.value : x)))}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n}>{n}</option>)}
          </select>
        </F>
      ))}
      <input placeholder="Commento" value={t} onChange={(e) => setT(e.target.value)} />
      <button className="y" onClick={() => onSubmit(c.reduce((a, b) => a + b) / 3, t)}>Pubblica recensione</button>
    </div>
  )
}

function Reviews({ kind, target }) {
  const { s } = useStore()
  return s.reviews.filter((r) => r.kind === kind && r.target === target)
    .map((r) => <p key={r.id} className="rev">{r.score.toFixed(1)}/5 {r.text}</p>)
}

function Home({ go }) {
  return (
    <section>
      <h1>Zwischenraum<br />Berlin</h1>
      <p className="lead">Berlino ha stanze vuote – negozi, uffici, magazzini – che restano inutilizzate per mesi, mentre i collettivi faticano a trovare luoghi in cui esprimersi.</p>
      <p>Costruiamo un ponte digitale diretto tra chi ha spazi vuoti e chi cerca luoghi per la cultura underground e gli eventi.</p>
      <div className="grid2">
        <button className="void big" onClick={() => go('need')}>Need a space?<small>Collettivi e organizzatori</small></button>
        <button className="void big" onClick={() => go('have')}>Have a space?<small>Proprietari di immobili</small></button>
      </div>
      <h2>Come procede il progetto</h2>
      <div className="grid3">
        {[['Ricerca', 'Sondaggi e interviste con collettivi e proprietari.'],
          ['Design', 'Identità, flussi e prototipo dell’app.'],
          ['Pilot', 'Test sul campo in alcuni quartieri.']].map(([t, d], i) => (
          <div key={t} className={i === 2 ? 'card void' : 'card ' + (i === 0 ? 'fill' : 'void')}><b>{t}</b><p>{d}</p></div>
        ))}
      </div>
    </section>
  )
}

function Need() {
  const S = useStore(), { s } = S, me = s.me.collective
  const [f, setF] = useState({ type: '', genre: '', power: false, sound: false, hood: '', budget: '' })
  const [sel, setSel] = useState(null), [d, setD] = useState(''), [c, setC] = useState(''), [msg, setMsg] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const list = s.spaces
    .filter((x) => (!f.type || x.type === f.type) && (!f.genre || x.genres.includes(f.genre)) && (!f.power || x.power) &&
      (!f.sound || x.sound) && (!f.hood || x.hood === f.hood) && (!f.budget || x.price <= +f.budget))
    .map((x) => ({ ...x, booked: s.requests.some((r) => r.spaceId === x.id && r.status === 'accepted') }))
  const sp = s.spaces.find((x) => x.id === sel)
  const send = () => {
    if (!me) return setMsg('Inserisci prima il nome del collettivo.')
    if (!fits(sp, d, s.requests)) return setMsg('La data non rientra in una finestra libera.')
    S.request({ spaceId: sp.id, collective: me, date: d, concept: c })
    setMsg('Richiesta inviata. La trovi in “Le mie richieste”.'); setD(''); setC('')
  }
  return (
    <section>
      <h2>Need a space?</h2>
      <F l="Nome del collettivo"><input value={me} onChange={(e) => S.set('me', { ...s.me, collective: e.target.value })} placeholder="es. Nachtland" /></F>
      <div className="filters void pad">
        <F l="Tipo di spazio"><select value={f.type} onChange={set('type')}><option value="">Tutti</option>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></F>
        <F l="Genere di evento"><select value={f.genre} onChange={set('genre')}><option value="">Tutti</option>{GENRES.map((t) => <option key={t}>{t}</option>)}</select></F>
        <F l="Budget massimo al giorno (€)"><input type="number" min="0" value={f.budget} onChange={set('budget')} /></F>
        <label className="chk"><input type="checkbox" checked={f.power} onChange={set('power')} /> Corrente elettrica</label>
        <label className="chk"><input type="checkbox" checked={f.sound} onChange={set('sound')} /> Isolamento acustico</label>
        <p className="hint">Zona: tocca un quartiere sulla mappa{f.hood ? ` (ora: ${f.hood})` : ''}.</p>
      </div>
      <MapView spaces={list} hood={f.hood} onHood={(h) => setF((p) => ({ ...p, hood: h }))} onSpace={setSel} />
      <p>{list.length} spazi trovati</p>
      <div className="grid2">
        {list.map((x) => (
          <div key={x.id} className={'card ' + (x.id === sel ? 'fill' : 'void')} onClick={() => { setSel(x.id); setMsg('') }}>
            <b>{x.name}</b>
            <p>{x.type}, {x.hood} – {x.m2} m² – {x.price} €/giorno</p>
            <p>{x.power ? 'Corrente' : 'Senza corrente'}, {x.sound ? 'isolato' : 'non isolato'}. Reputazione: {rate(S.score('space', x.id))}</p>
          </div>
        ))}
      </div>
      {sp && (
        <div className="void pad">
          <h3>{sp.name}</h3>
          <p>Disponibile: {sp.windows.length ? sp.windows.map(wlabel).join('; ') : 'nessuna finestra'}</p>
          <Reviews kind="space" target={sp.id} />
          <F l="Data dell’evento"><input type="date" value={d} onChange={(e) => setD(e.target.value)} /></F>
          <F l="Concept dell’evento"><textarea value={c} onChange={(e) => setC(e.target.value)} /></F>
          <button className="y" onClick={send}>Invia richiesta</button> {msg && <span className="hint">{msg}</span>}
        </div>
      )}
    </section>
  )
}

function Reqs() {
  const S = useStore(), { s } = S, me = s.me.collective
  if (!me) return <section><p>Inserisci il nome del collettivo in “Need a space?” per vedere le tue richieste.</p></section>
  const mine = s.requests.filter((r) => r.collective === me)
  return (
    <section>
      <h2>Le mie richieste</h2>
      {!mine.length && <p>Nessuna richiesta: scegli uno spazio sulla mappa.</p>}
      {mine.map((r) => {
        const sp = s.spaces.find((x) => x.id === r.spaceId)
        const done = s.reviews.some((v) => v.requestId === r.id && v.kind === 'space')
        return (
          <div key={r.id} className={'card ' + (r.status === 'accepted' ? 'fill' : 'void')}>
            <b>{sp.name}</b> – {r.date} – {STATUS[r.status]}
            {r.status === 'accepted' && <button onClick={() => S.setStatus(r.id, 'completed')}>Segna l’evento come concluso</button>}
            {r.status === 'completed' && !done && (
              <ReviewForm labels={['Veridicità delle condizioni', 'Puntualità', 'Comunicazione']}
                onSubmit={(score, text) => S.review({ requestId: r.id, kind: 'space', target: sp.id, score, text })} />
            )}
            {done && <p>Recensione pubblicata.</p>}
          </div>
        )
      })}
    </section>
  )
}

function Windows({ sp }) {
  const S = useStore()
  const [w, setW] = useState({ from: '', to: '', weekend: false })
  const add = () => { if (w.from && w.to && w.from <= w.to) { S.addWindow(sp.id, w); setW({ from: '', to: '', weekend: false }) } }
  return (
    <div>
      {sp.windows.map((x) => <p key={x.id}>{wlabel(x)} <button onClick={() => S.delWindow(sp.id, x.id)}>Rimuovi</button></p>)}
      <div className="row">
        <input type="date" value={w.from} onChange={(e) => setW({ ...w, from: e.target.value })} />
        <input type="date" value={w.to} onChange={(e) => setW({ ...w, to: e.target.value })} />
        <label className="chk"><input type="checkbox" checked={w.weekend} onChange={(e) => setW({ ...w, weekend: e.target.checked })} /> Solo weekend</label>
        <button className="y" onClick={add}>Aggiungi finestra</button>
      </div>
    </div>
  )
}

function Have() {
  const S = useStore(), { s } = S, me = s.me.owner
  const empty = { name: '', m2: '', price: '', type: TYPES[0], hood: 'Kreuzberg', power: false, sound: false, genres: [] }
  const [f, setF] = useState(empty), [pos, setPos] = useState(null)
  const mine = s.spaces.filter((x) => x.owner === me)
  const reqs = s.requests.filter((r) => mine.some((x) => x.id === r.spaceId))
  const add = () => {
    if (!f.name || !f.m2 || !f.price) return
    const [lat, lng] = pos || HOODS[f.hood]
    S.addSpace({ ...f, m2: +f.m2, price: +f.price, lat, lng, owner: me }); setF(empty); setPos(null)
  }
  const tg = (g) => setF({ ...f, genres: f.genres.includes(g) ? f.genres.filter((x) => x !== g) : [...f.genres, g] })
  return (
    <section>
      <h2>Have a space?</h2>
      <F l="Il tuo nome"><input value={me} onChange={(e) => S.set('me', { ...s.me, owner: e.target.value })} /></F>
      <div className="void pad">
        <h3>Nuovo spazio</h3>
        <F l="Nome dello spazio"><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></F>
        <div className="row">
          <F l="Metri quadrati"><input type="number" min="1" value={f.m2} onChange={(e) => setF({ ...f, m2: e.target.value })} /></F>
          <F l="Costo al giorno (€)"><input type="number" min="0" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} /></F>
          <F l="Tipo"><select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></F>
          <F l="Quartiere"><select value={f.hood} onChange={(e) => { setF({ ...f, hood: e.target.value }); setPos(null) }}>{Object.keys(HOODS).map((t) => <option key={t}>{t}</option>)}</select></F>
        </div>
        <label className="chk"><input type="checkbox" checked={f.power} onChange={(e) => setF({ ...f, power: e.target.checked })} /> Corrente elettrica</label>
        <label className="chk"><input type="checkbox" checked={f.sound} onChange={(e) => setF({ ...f, sound: e.target.checked })} /> Isolamento acustico</label>
        <div className="row">{GENRES.map((g) => <label key={g} className="chk"><input type="checkbox" checked={f.genres.includes(g)} onChange={() => tg(g)} /> {g}</label>)}</div>
        <p className="hint">Posizione precisa: tocca la mappa{pos ? ` (${pos[0].toFixed(4)}, ${pos[1].toFixed(4)})` : ` (altrimenti uso il centro di ${f.hood})`}.</p>
        <MapView pick={pos || HOODS[f.hood]} onPick={(la, ln) => setPos([la, ln])} height={280} />
        <button className="y" onClick={add}>Pubblica lo spazio</button>
      </div>
      <h3>I miei spazi</h3>
      {!mine.length && <p>Nessuno spazio: pubblica il primo qui sopra.</p>}
      {mine.map((sp) => (
        <div key={sp.id} className="card void">
          <b>{sp.name}</b> – {sp.m2} m², {sp.price} €/giorno – {sp.hood}. Reputazione: {rate(S.score('space', sp.id))}
          <h4>Finestre di disponibilità</h4>
          <Windows sp={sp} />
        </div>
      ))}
      <h3>Richieste ricevute</h3>
      {!reqs.length && <p>Nessuna richiesta ancora.</p>}
      {reqs.map((r) => {
        const sp = s.spaces.find((x) => x.id === r.spaceId)
        const done = s.reviews.some((v) => v.requestId === r.id && v.kind === 'collective')
        return (
          <div key={r.id} className={'card ' + (r.status === 'accepted' ? 'fill' : 'void')}>
            <b>{r.collective}</b> ({rate(S.score('collective', r.collective))}) per {sp.name}, {r.date} – {STATUS[r.status]}
            {r.concept && <p>{r.concept}</p>}
            <Reviews kind="collective" target={r.collective} />
            {r.status === 'pending' && (
              <div className="row">
                <button onClick={() => S.setStatus(r.id, fits({ ...sp }, r.date, s.requests) ? 'accepted' : 'rejected')}>Accetta</button>
                <button onClick={() => S.setStatus(r.id, 'rejected')}>Rifiuta</button>
              </div>
            )}
            {r.status === 'accepted' && <button onClick={() => S.setStatus(r.id, 'completed')}>Segna l’evento come concluso</button>}
            {r.status === 'completed' && !done && (
              <ReviewForm labels={['Rispetto dello spazio', 'Pulizia', 'Affidabilità']}
                onSubmit={(score, text) => S.review({ requestId: r.id, kind: 'collective', target: r.collective, score, text })} />
            )}
            {done && <p>Recensione pubblicata.</p>}
          </div>
        )
      })}
    </section>
  )
}

function Shell() {
  const [v, go] = useState('home'), S = useStore()
  const items = [['home', 'Zwischenraum'], ['need', 'Need a space?'], ['reqs', 'Le mie richieste'], ['have', 'Have a space?']]
  return (
    <>
      <header>{items.map(([k, l]) => <button key={k} className={v === k ? 'on' : ''} onClick={() => go(k)}>{l}</button>)}</header>
      <main>
        {v === 'home' && <Home go={go} />}{v === 'need' && <Need />}{v === 'reqs' && <Reqs />}{v === 'have' && <Have />}
      </main>
      <footer>Dati salvati nel tuo browser. <button onClick={() => confirm('Cancellare tutti i dati demo?') && S.reset()}>Ripristina i dati demo</button></footer>
    </>
  )
}

export default function App() { return <Provider><Shell /></Provider> }
