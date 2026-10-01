// Subscribe to one or more window events (the course's `ae:*` events); returns an unsubscribe function.
export function on(events: string | string[], fn: (e: any) => void): () => void {
  const list = Array.isArray(events) ? events : [events];
  list.forEach((n) => window.addEventListener(n, fn));
  return () => list.forEach((n) => window.removeEventListener(n, fn));
}
