export function formatTimeMessage(time: Date): string {
  const date = new Date(time);
  const s = `${date.getHours()}:${date.getMinutes()}`;
  return s;
}

export default {};
