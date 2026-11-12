import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { formatDate, timeAgo, today, topCategories } from './format';
import { NewsService } from './news.service';
import { Thumb } from './thumb';
import { Source } from './types';

@Component({
  selector: 'app-root',
  imports: [Thumb, NgTemplateOutlet],
  templateUrl: './app.html',
})
export class App {
  protected readonly news = inject(NewsService);
  protected readonly source = signal<string | null>(null);
  protected readonly category = signal<string | null>(null);
  protected readonly query = signal('');
  protected readonly formatDate = formatDate;
  protected readonly timeAgo = timeAgo;
  protected readonly today = today();

  protected readonly sources = computed(() => new Map((this.news.feed()?.sources ?? []).map((s) => [s.id, s])));
  private readonly bySource = computed(() => (this.news.feed()?.items ?? []).filter((i) => !this.source() || i.source === this.source()));
  protected readonly categories = computed(() => topCategories(this.bySource().map((i) => i.category)));

  protected readonly items = computed(() => {
    const q = this.query().trim().toLocaleLowerCase('nb');
    const cat = this.category();
    return this.bySource().filter(
      (i) =>
        (!cat || i.category === cat) &&
        (!q || i.title.toLocaleLowerCase('nb').includes(q) || i.summary.toLocaleLowerCase('nb').includes(q)),
    );
  });
  // The most recent article with an image is the featured story ("Hovedsak").
  protected readonly hero = computed(() => this.items().find((i) => i.image) ?? this.items()[0]);
  protected readonly rest = computed(() => this.items().filter((i) => i !== this.hero()));

  protected sourceOf(id: string): Source | undefined {
    return this.sources().get(id);
  }

  protected selectSource(id: string | null): void {
    this.source.set(id);
    this.category.set(null);
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
