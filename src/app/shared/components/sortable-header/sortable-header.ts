import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sortable-header',
  imports: [],
  templateUrl: './sortable-header.html',
  styleUrl: './sortable-header.scss',
})
export class SortableHeader<TColumn extends string = string> {
  @Input() label!: string;
  @Input() column!: TColumn;
  @Input() active!: TColumn | null;
  @Input() direction: 'asc' | 'desc' | null = null;
  @Output() sort = new EventEmitter<TColumn>();

  emitSort() {
    this.sort.emit(this.column);
  }
}
