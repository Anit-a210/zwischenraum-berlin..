export const HOODS = {
  Friedrichshain: [52.5159, 13.454],
  Kreuzberg: [52.4986, 13.403],
  'Neukölln': [52.4811, 13.435],
  Wedding: [52.55, 13.354],
  Lichtenberg: [52.513, 13.499],
  Moabit: [52.53, 13.342],
}
export const TYPES = ['Magazzino', 'Negozio vuoto', 'Ufficio dismesso', 'Seminterrato']
export const GENRES = ['techno', 'ambient', 'live', 'jazz', 'experimental']

const sp = (id, name, type, hood, i, m2, price, power, sound, genres, from, to, weekend) => ({
  id, name, type, hood, m2, price, power, sound, genres, owner: 'Demo Owner',
  lat: HOODS[hood][0] + i * 0.004, lng: HOODS[hood][1] + i * 0.005,
  windows: [{ id: id + 'w', from, to, weekend: !!weekend }],
})

export const SEED = {
  me: { collective: '', owner: 'Demo Owner' },
  spaces: [
    sp('s1', 'Lagerhalle an der Spree', 'Magazzino', 'Friedrichshain', 1, 420, 150, true, false, ['techno', 'experimental'], '2026-11-01', '2026-12-31'),
    sp('s2', 'Ex-Bäckerei Reuterkiez', 'Negozio vuoto', 'Neukölln', 1, 95, 60, true, true, ['ambient', 'live'], '2026-11-01', '2027-01-31', true),
    sp('s3', 'Büro im vierten Stock', 'Ufficio dismesso', 'Kreuzberg', -1, 180, 90, false, true, ['jazz', 'ambient'], '2026-11-15', '2026-12-15'),
    sp('s4', 'Keller Müllerstraße', 'Seminterrato', 'Wedding', 0, 140, 80, true, true, ['techno', 'live'], '2026-11-01', '2026-11-30', true),
    sp('s5', 'Fabrikhalle Herzbergstraße', 'Magazzino', 'Lichtenberg', 1, 700, 220, true, false, ['techno', 'experimental', 'live'], '2026-12-01', '2027-03-31'),
    sp('s6', 'Laden Turmstraße', 'Negozio vuoto', 'Moabit', 0, 70, 40, false, false, ['ambient', 'jazz'], '2026-11-01', '2026-11-30'),
  ],
  requests: [],
  reviews: [],
}
