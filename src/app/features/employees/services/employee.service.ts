import { DestroyRef, inject, Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, of } from 'rxjs';
import { Employee } from '../models/employee.model';
import { INITIAL_EMPLOYEES } from '../data/employee.data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const DELAY_TIME = 300;

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly STORAGE_KEY = 'employees';

  private readonly employees$ = new BehaviorSubject<Employee[]>(
    this.loadFromStorage() ?? INITIAL_EMPLOYEES
  );

  constructor() {
    this.employees$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((employees) => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(employees));
      });
  }

  private loadFromStorage(): Employee[] | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  getEmployees$(): Observable<Employee[]> {
    return this.employees$.asObservable();
  }

  getEmployeeByRegistrationNumber$(
    registrationNumber: string
  ): Observable<Employee | null> {
    return this.getEmployees$().pipe(
      map(
        (employees) =>
          employees.find((e) => e.registrationNumber === registrationNumber) ??
          null
      )
    );
  }

  addEmployee(
    payload: Omit<Employee, 'id' | 'registrationNumber'>
  ): Observable<Employee> {
    const id = crypto.randomUUID();
    const registrationNumber = this.getNextRegistrationNumber();
    const createdEmployee = { id, registrationNumber, ...payload };
    this.employees$.next([...this.employees$.value, createdEmployee]);
    return of(createdEmployee).pipe(delay(DELAY_TIME));
  }

  updateEmployee(payload: Employee) {
    const updatedEmployees = this.employees$.value.map((e) =>
      e.id === payload.id ? { ...e, ...payload } : e
    );
    this.employees$.next(updatedEmployees);
    const updatedEmployee = updatedEmployees.find((e) => e.id === payload.id);
    return of(updatedEmployee).pipe(delay(DELAY_TIME));
  }

  private getNextRegistrationNumber(): string {
    const current = this.employees$.value;
    const numericValues = current.map((e) =>
      parseInt(e.registrationNumber, 10)
    );
    const max = numericValues.length ? Math.max(...numericValues) : 0;
    const next = max + 1;
    return String(next).padStart(8, '0');
  }
}
