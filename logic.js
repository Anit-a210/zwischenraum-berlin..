export function filterSpaces(spaces, f) {
  return spaces.filter((s) =>
    (!f.district || s.district === f.district) &&
    (!f.genre || s.genres.includes(f.genre)) &&
    (!f.tech || s.tech.includes(f.tech)) &&
    (!f.maxCost || s.cost <= Number(f.maxCost)) &&
    (!f.minSqm || s.sqm >= Number(f.minSqm))
  );
}
export function averageRating(reviews, targetType, targetId) {
  const r = reviews.filter((x) => x.targetType === targetType && x.targetId === targetId);
  if (!r.length) return null;
  return { avg: r.reduce((a, x) => a + x.rating, 0) / r.length, count: r.length };
}
