import { createContext, useContext, useEffect, useState } from 'react'
import { SEED } from './data'

const Ctx = createContext()
const KEY = 'zwischenraum-berlin-v1'
export const useStore = () => useContext(Ctx)
const uid = () => Math.random().toString(36).slice(2, 9)

export function Provider({ children }) {
  const [s, setS] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || SEED } catch { return SEED }
  })
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(s)) }, [s])
  const up = (fn) => setS((p) => fn(structuredClone(p)))
  const space = (d, id) => d.spaces.find((x) => x.id === id)

  const api = {
    s,
    set: (k, v) => up((d) => { d[k] = v; return d }),
    addSpace: (x) => up((d) => { d.spaces.push({ ...x, id: uid(), windows: [] }); return d }),
    addWindow: (sid, w) => up((d) => { space(d, sid).windows.push({ ...w, id: uid() }); return d }),
    delWindow: (sid, wid) => up((d) => { const x = space(d, sid); x.windows = x.windows.filter((w) => w.id !== wid); return d }),
    request: (r) => up((d) => { d.requests.push({ ...r, id: uid(), status: 'pending' }); return d }),
    setStatus: (rid, st) => up((d) => { d.requests.find((r) => r.id === rid).status = st; return d }),
    review: (r) => up((d) => { d.reviews.push({ ...r, id: uid() }); return d }),
    reset: () => setS(SEED),
    // Reputazione: media dei punteggi ricevuti. kind = 'space' | 'collective'
    score: (kind, target) => {
      const l = s.reviews.filter((r) => r.kind === kind && r.target === target)
      return l.length ? { avg: l.reduce((a, r) => a + r.score, 0) / l.length, n: l.length } : null
    },
  }
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
