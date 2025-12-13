export function hsl (h) {
  if (h === 0) return "transparent";
  return `hsl(${Math.floor(h * 360)}, 70%, 60%)`;
}