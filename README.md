# Zwischenraum Berlin

Prototipo funzionante dell'app che collega collettivi e organizzatori di eventi con proprietari di spazi vuoti (Leerstand) a Berlino, per usi temporanei (Zwischennutzung).

Stile: nero, giallo BVG (#FFD100), bordi tratteggiati per gli spazi vuoti che si riempiono di giallo quando vengono attivati o prenotati.

## Requisiti

- Node.js 18 o superiore
- Connessione a internet (installazione dei pacchetti e tile della mappa)

## Avvio in locale

```bash
npm install
npm run dev
```

Apri l'indirizzo mostrato nel terminale (di solito http://localhost:5173).

Altri comandi:

```bash
npm run build     # build di produzione nella cartella dist/
npm run preview   # serve la build in locale
```

## Cosa contiene

| Area | Dove |
|---|---|
| Landing: concept, mission, fasi (Ricerca, Design, Pilot) | `src/App.jsx` (`Home`) |
| Flusso collettivi: nome, filtri (tipo, genere, corrente, isolamento, budget), zona sulla mappa, richiesta | `src/App.jsx` (`Need`, `Reqs`) |
| Flusso proprietari: nuovo spazio (m², costo, posizione sulla mappa), finestre di disponibilità, gestione richieste | `src/App.jsx` (`Have`, `Windows`) |
| Mappa interattiva dark con quartieri tratteggiati | `src/MapView.jsx` |
| Stato, persistenza e logica delle recensioni | `src/store.jsx` |
| Dati demo (6 spazi in 6 quartieri) | `src/data.js` |
| Stile | `src/styles.css` |

## Come testare il flusso completo

I dati stanno nel `localStorage` del browser e non c'è login: cambi ruolo con il menu in alto.

1. **Need a space?** Scrivi il nome del collettivo (es. "Nachtland"). Filtra per tipo, genere, budget o tocca un quartiere sulla mappa. Scegli uno spazio, inserisci una data dentro la sua finestra di disponibilità (es. un giorno di novembre 2026; per gli spazi "solo weekend" un sabato o una domenica) e invia la richiesta. Una data fuori dalle finestre viene rifiutata.
2. **Have a space?** Il proprietario demo è "Demo Owner" (possiede i 6 spazi demo). In "Richieste ricevute" accetta la richiesta: la card diventa gialla. Qui puoi anche pubblicare nuovi spazi e gestire le finestre di disponibilità (anche "solo weekend").
3. Segna l'evento come concluso (da entrambi i lati). Poi:
   - il proprietario recensisce il collettivo (rispetto dello spazio, pulizia, affidabilità);
   - il collettivo, da **Le mie richieste**, recensisce lo spazio (veridicità delle condizioni, puntualità, comunicazione).
4. Le medie appaiono su spazi e collettivi. "Ripristina i dati demo" in fondo alla pagina azzera tutto.

## Limiti di questa versione

- Niente backend né autenticazione: gli utenti sono identificati dal nome inserito.
- Le zone sono cerchi attorno ai centri dei quartieri, non i poligoni ufficiali.
- Foto degli spazi, notifiche e app mobile non sono incluse.

## Passo successivo consigliato

Sostituire `src/store.jsx` con Supabase (PostgreSQL + PostGIS, Auth con ruoli `collective` e `owner`, Storage per le foto) mantenendo la stessa interfaccia del provider, e poi aggiungere l'app mobile con Expo riusando la logica.
