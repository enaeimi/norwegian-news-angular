import { Component, computed, input, output } from '@angular/core';
import { pageList, PagerLabels } from './paging';

@Component({
  selector: 'app-pager',
  host: { style: 'display: contents' },
  template: `
    @if (total() > 1) {
      <nav class="pager" [attr.aria-label]="labels().nav">
        <button class="pager-step" [disabled]="page() <= 1" (click)="pageChange.emit(page() - 1)">{{ labels().prev }}</button>
        @for (p of pages(); track $index) {
          @if (p === null) {
            <span class="pager-gap">…</span>
          } @else {
            <button class="pager-num" [class.active]="p === page()" [attr.aria-current]="p === page() ? 'page' : null" (click)="pageChange.emit(p)">
              {{ labels().num(p) }}
            </button>
          }
        }
        <button class="pager-step" [disabled]="page() >= total()" (click)="pageChange.emit(page() + 1)">{{ labels().next }}</button>
      </nav>
    }
  `,
})
export class Pager {
  readonly page = input.required<number>();
  readonly total = input.required<number>();
  readonly labels = input.required<PagerLabels>();
  readonly pageChange = output<number>();
  protected readonly pages = computed(() => pageList(this.page(), this.total()));
}
