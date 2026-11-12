import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { NewsFeed } from './types';

const REFRESH_MS = 5 * 60_000;

@Injectable({ providedIn: 'root' })
export class NewsService {
  readonly feed = signal<NewsFeed | null>(null);
  readonly error = signal<string | null>(null);
  readonly loading = signal(true);

  constructor() {
    this.load();
    const id = setInterval(() => this.load(), REFRESH_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      // Relative URL resolves against <base href> (works on GitHub Pages); cache-busted.
      const res = await fetch(`news.json?t=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.feed.set((await res.json()) as NewsFeed);
      this.error.set(null);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    } finally {
      this.loading.set(false);
    }
  }
}
