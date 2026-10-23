# Zwischenraum Berlin

A web app that connects collectives who need a space with owners of empty spaces in Berlin. All interface text is in English.

## Features
- "Need a space?" flow for collectives: profile, district, budget
- "Have a space?" flow for owners: name, size, location, cost, availability window
- Minimal, industrial map with pins and a BVG-yellow, dashed-line identity
- Filters: district, event genre, power and technical needs, budget, size
- Mutual reviews between collectives and owners, with average ratings
- Research, Design and Pilot phases section

## Run locally
Requires Node.js 18 or newer.

```bash
npm install
npm run dev      # opens http://localhost:5173
```

## Test and build
```bash
npm test         # unit tests for filtering and review logic
npm run build    # production build in /dist
npm run preview  # preview the production build
```

## Structure
- `src/App.jsx`: pages and components
- `src/data.js`: districts, filter options, sample spaces and reviews
- `src/logic.js`: filtering and rating logic (tested in `src/logic.test.js`)
- `src/styles.css`: styling
