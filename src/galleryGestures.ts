// Ignore taps, short drags, and mostly vertical scrolling.
export function swipeDirection(start: { x:number; y:number }, end: { x:number; y:number }): -1 | 0 | 1 {
  const dx=end.x-start.x,dy=end.y-start.y;
  if(Math.abs(dx)<=60 || Math.abs(dx)<=Math.abs(dy)*1.4) return 0;
  return dx<0?1:-1;
}
