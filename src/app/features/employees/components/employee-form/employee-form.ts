import { Component, DestroyRef, inject, Input } from '@angular/core';
import { Employee, Gender } from '../../models/employee.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { ControlErrors } from '../../../../shared/components/control-errors/control-errors';
import { AppValidators } from '../../../../shared/validators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-employee-form',
  imports: [CommonModule, ReactiveFormsModule, ControlErrors],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss',
})
export class EmployeeForm {
  @Input() set employee(value: Employee | null) {
    this._employee = value;
    this.submitLabel = value ? 'Zapisz' : 'Dodaj';

    if (value) {
      this.form.setValue({
        firstName: value.firstName,
        lastName: value.lastName,
        gender: value.gender,
      });
    } else {
      this.form.reset({ firstName: '', lastName: '', gender: null });
    }
  }

  get employee(): Employee | null {
    return this._employee;
  }

  Gender = Gender;
  submitLabel = 'Dodaj';
  form = new FormGroup({
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        AppValidators.notBlankValidator(),
      ],
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        AppValidators.notBlankValidator(),
      ],
    }),
    gender: new FormControl<Gender | null>(null, {
      validators: [Validators.required],
    }),
  });

  private _employee: Employee | null = null;
  private readonly router: Router = inject(Router);
  private readonly employeeService: EmployeeService = inject(EmployeeService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsDirty();
      return;
    }

    const { firstName, lastName, gender } = this.form.getRawValue();
    const payload = { firstName, lastName, gender: gender! };

    this.addOrUpdateEmployee(payload);
  }

  onCancel() {
    this.router.navigate(['/employees']);
  }

  private addOrUpdateEmployee(
    payload: Omit<Employee, 'id' | 'registrationNumber'>
  ) {
    const req$ = this._employee
      ? this.employeeService.updateEmployee({
          ...this._employee,
          ...payload,
        })
      : this.employeeService.addEmployee(payload);

    req$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.router.navigate(['/employees']),
    });
  }
}
