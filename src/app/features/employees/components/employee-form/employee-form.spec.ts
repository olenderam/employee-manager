import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { EmployeeForm } from './employee-form';
import { EmployeeService } from '../../services/employee.service';
import { Employee, Gender } from '../../models/employee.model';

describe('EmployeeForm', () => {
  let router: Router;
  let employeeServiceSpy: jasmine.SpyObj<EmployeeService>;

  const existing: Employee = {
    id: 'uuid-1',
    registrationNumber: '00000001',
    firstName: 'John',
    lastName: 'Doe',
    gender: Gender.Male,
  };

  function setInputValue(input: HTMLInputElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  beforeEach(async () => {
    employeeServiceSpy = jasmine.createSpyObj('EmployeeService', [
      'addEmployee',
      'updateEmployee',
    ]);

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, EmployeeForm],
      providers: [{ provide: EmployeeService, useValue: employeeServiceSpy }],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
  });

  it('should show create view', () => {
    const fixture = TestBed.createComponent(EmployeeForm);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(component).toBeTruthy();
    expect(component.submitLabel).toBe('Dodaj');
    expect(submitBtn.textContent?.trim()).toBe('Dodaj');

    expect(component.form.value).toEqual({
      firstName: '',
      lastName: '',
      gender: null,
    });
  });

  it('should show edit view', () => {
    const fixture = TestBed.createComponent(EmployeeForm);
    const component = fixture.componentInstance;
    component.employee = existing;

    fixture.detectChanges();

    const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(component.submitLabel).toBe('Zapisz');
    expect(submitBtn.textContent?.trim()).toBe('Zapisz');
    expect(component.form.getRawValue()).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      gender: Gender.Male,
    });
    const regInput: HTMLInputElement | null =
      fixture.nativeElement.querySelector('input[disabled]');
    expect(regInput?.value).toBe('00000001');
  });

  it('should not submit when invalid', () => {
    const fixture = TestBed.createComponent(EmployeeForm);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const formEl: HTMLFormElement = fixture.nativeElement.querySelector('form');
    formEl.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(component.form.invalid).toBeTrue();
    expect(component.form.controls.firstName.dirty).toBeTrue();
    expect(component.form.controls.lastName.dirty).toBeTrue();
    expect(component.form.controls.gender.dirty).toBeTrue();
    expect(employeeServiceSpy.addEmployee).not.toHaveBeenCalled();
    expect(employeeServiceSpy.updateEmployee).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should create employee', () => {
    const fixture = TestBed.createComponent(EmployeeForm);
    fixture.detectChanges();
    const firstNameInput: HTMLInputElement =
      fixture.nativeElement.querySelector('input[formControlName="firstName"]');
    const lastNameInput: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[formControlName="lastName"]'
    );
    setInputValue(firstNameInput, 'Alice');
    setInputValue(lastNameInput, 'Brown');
    const select: HTMLSelectElement = fixture.nativeElement.querySelector(
      'select[formControlName="gender"]'
    );
    select.value = select.options[0].value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    employeeServiceSpy.addEmployee.and.returnValue(
      of({
        id: 'uuid-1',
        registrationNumber: '00000001',
        firstName: 'Alice',
        lastName: 'Brown',
        gender: Gender.Female,
      })
    );

    const formEl: HTMLFormElement = fixture.nativeElement.querySelector('form');
    formEl.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(employeeServiceSpy.addEmployee).toHaveBeenCalledOnceWith({
      firstName: 'Alice',
      lastName: 'Brown',
      gender: Gender.Female,
    });
    expect(router.navigate).toHaveBeenCalledOnceWith(['/employees']);
  });

  it('should edit employee', async () => {
    const fixture = TestBed.createComponent(EmployeeForm);
    const component = fixture.componentInstance;
    component.employee = existing;
    fixture.detectChanges();

    const lastNameInput: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[formControlName="lastName"]'
    );
    setInputValue(lastNameInput, 'Doee');
    const firstNameInput: HTMLInputElement =
      fixture.nativeElement.querySelector('input[formControlName="firstName"]');
    setInputValue(firstNameInput, 'Johnny');
    component.form.controls.gender.setValue(Gender.Male);
    fixture.detectChanges();

    employeeServiceSpy.updateEmployee.and.returnValue(
      of({
        id: 'uuid-1',
        registrationNumber: '00000001',
        firstName: 'Johnny',
        lastName: 'Doee',
        gender: Gender.Male,
      })
    );

    const formEl: HTMLFormElement = fixture.nativeElement.querySelector('form');
    formEl.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(employeeServiceSpy.updateEmployee).toHaveBeenCalledTimes(1);
    expect(employeeServiceSpy.updateEmployee).toHaveBeenCalledWith({
      id: 'uuid-1',
      registrationNumber: '00000001',
      firstName: 'Johnny',
      lastName: 'Doee',
      gender: Gender.Male,
    });
    expect(router.navigate).toHaveBeenCalledOnceWith(['/employees']);
  });

  it('should navigates back to /employees on cancel', () => {
    const fixture = TestBed.createComponent(EmployeeForm);
    fixture.detectChanges();

    const cancelBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="button"]'
    );
    cancelBtn.click();

    expect(router.navigate).toHaveBeenCalledOnceWith(['/employees']);
  });
});
