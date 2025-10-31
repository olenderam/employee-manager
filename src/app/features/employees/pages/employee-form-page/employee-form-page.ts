import { Component, inject, Input } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { map, Observable, of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { EmployeeForm } from '../../components/employee-form/employee-form';

@Component({
  selector: 'app-employee-form-page',
  imports: [CommonModule, EmployeeForm],
  templateUrl: './employee-form-page.html',
  styleUrl: './employee-form-page.scss',
})
export class EmployeeFormPage {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly employeeService: EmployeeService = inject(EmployeeService);
  title$ = this.route.data.pipe(
    map((data) =>
      data['mode'] === 'edit' ? 'Edytuj pracownika' : 'Dodaj pracownika'
    )
  );
  employee$: Observable<Employee | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const registrationNumber = params.get('registrationNumber');
      if (!registrationNumber) {
        return of(null);
      }

      return this.employeeService.getEmployeeByRegistrationNumber$(
        registrationNumber
      );
    })
  );
}
