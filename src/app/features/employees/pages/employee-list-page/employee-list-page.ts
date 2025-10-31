import { Component } from '@angular/core';
import { EmployeeList } from '../../components/employee-list/employee-list';
import { BehaviorSubject } from 'rxjs';
import {
  EmployeeFilters,
  EmployeeFiltersModel,
} from '../../components/employee-filters/employee-filters';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-list-page',
  imports: [EmployeeList, EmployeeFilters, RouterModule],
  templateUrl: './employee-list-page.html',
  styleUrl: './employee-list-page.scss',
})
export class EmployeeListPage {
  filters$ = new BehaviorSubject<EmployeeFiltersModel>({
    firstName: '',
    lastName: '',
  });

  onFiltersChange(filters: EmployeeFiltersModel) {
    this.filters$.next(filters);
  }
}
