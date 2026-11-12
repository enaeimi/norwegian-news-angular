import { Component, input, signal } from '@angular/core';
import { Source } from './types';

/** Article image, or a coloured placeholder with the source name if missing/broken. */
@Component({
  selector: 'app-thumb',
  host: { style: 'display: contents' },
  template: `
    @if (src() && !broken()) {
      <img class="thumb" [src]="src()" alt="" loading="lazy" referrerpolicy="no-referrer" (error)="broken.set(true)" />
    } @else {
      <div class="thumb placeholder" [style.background]="source()?.color ?? '#555'">{{ source()?.name }}</div>
    }
  `,
})
export class Thumb {
  readonly src = input<string | null>(null);
  readonly source = input<Source | undefined>();
  protected readonly broken = signal(false);
}
