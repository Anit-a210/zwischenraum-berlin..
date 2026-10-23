export const DISTRICTS = ["Kreuzberg", "Neukölln", "Friedrichshain", "Mitte", "Wedding", "Lichtenberg", "Treptow"];
export const DISTRICT_POS = {
  Mitte: [48, 40], Wedding: [40, 16], Friedrichshain: [68, 42], Kreuzberg: [46, 62],
  Neukölln: [56, 82], Treptow: [78, 76], Lichtenberg: [86, 30],
};
export const GENRES = ["Concert", "Exhibition", "Club night", "Theatre and performance", "Workshop", "Film screening"];
export const TECH = ["Standard sockets", "Three-phase power", "Sound system on site", "Daylight only"];
export const COLLECTIVE_TYPES = ["Music collective", "Visual arts collective", "Performance group", "Event crew", "Other"];
export const SPACE_TYPES = ["Warehouse", "Shopfront", "Courtyard", "Basement", "Office floor", "Other"];

export const INITIAL_SPACES = [
  { id: 1, name: "Former bakery on Wiener Straße", district: "Kreuzberg", sqm: 90, cost: 120, type: "Shopfront",
    genres: ["Exhibition", "Workshop", "Film screening"], tech: ["Standard sockets", "Daylight only"], windows: "Fri to Sun, in 3 weeks" },
  { id: 2, name: "Tempelhofer Hangar Annex", district: "Neukölln", sqm: 400, cost: 450, type: "Warehouse",
    genres: ["Club night", "Concert"], tech: ["Three-phase power", "Sound system on site"], windows: "Every second weekend" },
  { id: 3, name: "Empty office floor, Warschauer", district: "Friedrichshain", sqm: 220, cost: 300, type: "Office floor",
    genres: ["Exhibition", "Theatre and performance", "Workshop"], tech: ["Standard sockets"], windows: "Weekdays, next 6 weeks" },
  { id: 4, name: "Brewery cellar", district: "Wedding", sqm: 150, cost: 180, type: "Basement",
    genres: ["Concert", "Club night"], tech: ["Three-phase power"], windows: "Thu to Sat, next month" },
  { id: 5, name: "Courtyard behind the post office", district: "Mitte", sqm: 300, cost: 250, type: "Courtyard",
    genres: ["Film screening", "Concert", "Theatre and performance"], tech: ["Standard sockets", "Daylight only"], windows: "Weekends until October" },
  { id: 6, name: "Depot hall, Rummelsburg", district: "Lichtenberg", sqm: 600, cost: 520, type: "Warehouse",
    genres: ["Club night", "Exhibition"], tech: ["Three-phase power", "Sound system on site"], windows: "Single dates, on request" },
];

export const INITIAL_COLLECTIVES = ["Nachtbus Kollektiv", "Studio Spree", "Loop Theatre Lab"];

export const INITIAL_REVIEWS = [
  { id: 1, targetType: "space", targetId: 1, role: "Collective", author: "Studio Spree", rating: 5, text: "Clear handover, bright room, fair price." },
  { id: 2, targetType: "space", targetId: 2, role: "Collective", author: "Nachtbus Kollektiv", rating: 4, text: "Great power supply. Neighbours need notice for late events." },
  { id: 3, targetType: "collective", targetId: "Studio Spree", role: "Owner", author: "Owner of the bakery space", rating: 5, text: "Left the space cleaner than they found it." },
];
