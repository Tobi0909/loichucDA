/**
 * "Rút bài": trả về phần tử ngẫu nhiên và không lặp lại cho tới khi hết kho,
 * hết thì xáo lại. Toàn bộ trạng thái nằm trong bộ nhớ (KHÔNG localStorage).
 */
export class Deck<T> {
  private readonly source: readonly T[];
  private pile: T[] = [];
  private last: T | undefined;

  constructor(source: readonly T[]) {
    this.source = source.length > 0 ? source : ([] as readonly T[]);
    this.reshuffle();
  }

  private reshuffle(): void {
    const next = [...this.source];
    // Fisher-Yates
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const a = next[i] as T;
      const b = next[j] as T;
      next[i] = b;
      next[j] = a;
    }
    // Tránh lá đầu của bộ mới trùng lá cuối vừa rút
    if (next.length > 1 && this.last !== undefined && next[0] === this.last) {
      const a = next[0] as T;
      const b = next[1] as T;
      next[0] = b;
      next[1] = a;
    }
    this.pile = next;
  }

  draw(): T | undefined {
    if (this.source.length === 0) return undefined;
    if (this.pile.length === 0) this.reshuffle();
    const card = this.pile.pop();
    this.last = card;
    return card;
  }
}

/** Gom nhiều deck lại cho gọn khi dùng trong component. */
export function createDecks<K extends string>(
  sources: Record<K, readonly string[]>,
): Record<K, Deck<string>> {
  const out = {} as Record<K, Deck<string>>;
  for (const key of Object.keys(sources) as K[]) {
    out[key] = new Deck(sources[key]);
  }
  return out;
}
