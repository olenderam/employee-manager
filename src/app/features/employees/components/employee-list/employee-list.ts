import { Component, inject, Input, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { CommonModule } from '@angular/common';
import { EmployeeFiltersModel } from '../employee-filters/employee-filters';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SortableHeader } from '../../../../shared/components/sortable-header/sortable-header';

type SortingState = {
  active: keyof Employee;
  direction: 'asc' | 'desc' | null;
};

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, SortableHeader],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList implements OnInit {
  @Input() filters$!: Observable<EmployeeFiltersModel>;
  viewList$!: Observable<Employee[]>;
  columns = {
    registrationNumber: 'registrationNumber',
    firstName: 'firstName',
    lastName: 'lastName',
    gender: 'gender',
  };
  private readonly employeeService: EmployeeService = inject(EmployeeService);
  private readonly router: Router = inject(Router);
  private readonly employees$: Observable<Employee[]> =
    this.employeeService.getEmployees$();
  readonly sort$ = new BehaviorSubject<SortingState>({
    active: 'registrationNumber',
    direction: 'asc',
  });
  private readonly collator = new Intl.Collator(navigator.language || 'en', {
    sensitivity: 'base',
    numeric: true,
  });

  ngOnInit(): void {
    this.viewList$ = combineLatest([
      this.employees$,
      this.filters$,
      this.sort$,
    ]).pipe(
      map(([employees, filters, sort]) => {
        const filtered = employees.filter(
          (employee) =>
            this.matchesFilter(filters.firstName, employee.firstName) &&
            this.matchesFilter(filters.lastName, employee.lastName)
        );

        const sorted = [...filtered].sort((emp1, emp2) => {
          const emp1Value = emp1[sort.active];
          const emp2Value = emp2[sort.active];

          const comparsion = this.collator.compare(emp1Value, emp2Value);
          return sort.direction === 'asc' ? comparsion : -comparsion;
        });

        return sorted;
      })
    );
  }

  onSort(activeColumn: string) {
    const { active, direction } = this.sort$.value;
    const column = activeColumn as keyof Employee;

    this.sort$.next(
      active === column
        ? { active: column, direction: direction === 'asc' ? 'desc' : 'asc' }
        : { active: column, direction: 'asc' }
    );
  }

  editEmployee(employee: Employee) {
    this.router.navigate(['/employees', employee.registrationNumber, 'edit']);
  }

  private matchesFilter(filter: string | null, value: string) {
    if (!filter) {
      return true;
    }

    return value.toLowerCase().includes(filter.toLowerCase());
  }
}
