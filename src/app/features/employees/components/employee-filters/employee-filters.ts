import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export type EmployeeFiltersModel = { firstName: string; lastName: string };

@Component({
  selector: 'app-employee-filters',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-filters.html',
  styleUrl: './employee-filters.scss',
})
export class EmployeeFilters implements OnInit, OnChanges {
  @Input() filters: EmployeeFiltersModel = { firstName: '', lastName: '' };
  @Output() filtersChange = new EventEmitter<EmployeeFiltersModel>();

  form = new FormGroup({
    firstName: new FormControl(this.filters.firstName),
    lastName: new FormControl(this.filters.lastName),
  });

  ngOnInit() {
    this.form.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe((v) =>
        this.filtersChange.emit({
          firstName: v.firstName ?? '',
          lastName: v.lastName ?? '',
        })
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] && this.filters) {
      this.form.patchValue(this.filters, { emitEvent: false });
    }
  }

  clear() {
    this.form.reset({ firstName: '', lastName: '' });
  }
}
