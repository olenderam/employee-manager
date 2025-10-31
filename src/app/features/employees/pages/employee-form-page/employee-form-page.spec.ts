import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { EmployeeFormPage } from './employee-form-page';
import { Employee, Gender } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeForm } from '../../components/employee-form/employee-form';

describe('EmployeeFormPage', () => {
  let data$!: BehaviorSubject<Record<string, any>>;
  let paramMap$!: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let employeeServiceSpy: jasmine.SpyObj<EmployeeService>;

  function getH2(fixture: any): HTMLHeadingElement | null {
    return fixture.nativeElement.querySelector('h2');
  }

  function getEmployeeFormInstance(fixture: any): EmployeeForm | null {
    const debugEl = fixture.debugElement.query(By.directive(EmployeeForm));
    return debugEl?.componentInstance ?? null;
  }

  beforeEach(async () => {
    data$ = new BehaviorSubject<Record<string, any>>({ mode: 'create' });
    paramMap$ = new BehaviorSubject(convertToParamMap({}));

    employeeServiceSpy = jasmine.createSpyObj('EmployeeService', [
      'getEmployeeByRegistrationNumber$',
    ]);

    await TestBed.configureTestingModule({
      imports: [CommonModule, EmployeeFormPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: data$.asObservable(),
            paramMap: paramMap$.asObservable(),
          },
        },
        { provide: EmployeeService, useValue: employeeServiceSpy },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EmployeeFormPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render add employee page when create mode', async () => {
    const fixture = TestBed.createComponent(EmployeeFormPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const h2 = getH2(fixture);
    expect(h2?.textContent?.trim()).toBe('Dodaj pracownika');
  });

  it('should render edit employee page when edit mode', async () => {
    const fixture = TestBed.createComponent(EmployeeFormPage);
    fixture.detectChanges();

    data$.next({ mode: 'edit' });
    await fixture.whenStable();
    fixture.detectChanges();

    const h2 = getH2(fixture);
    expect(h2?.textContent?.trim()).toBe('Edytuj pracownika');
  });

  it('should not get employee when create mode', async () => {
    const fixture = TestBed.createComponent(EmployeeFormPage);
    fixture.detectChanges();

    paramMap$.next(convertToParamMap({}));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(
      employeeServiceSpy.getEmployeeByRegistrationNumber$
    ).not.toHaveBeenCalled();
    const child = getEmployeeFormInstance(fixture);
    expect(child).toBeTruthy();
    expect(child!.employee).toBeNull();
  });

  it('should get employee when edit mode', async () => {
    const fixture = TestBed.createComponent(EmployeeFormPage);
    fixture.detectChanges();
    const mockEmployee: Employee = {
      id: 'uuid-1',
      registrationNumber: '00000001',
      firstName: 'John',
      lastName: 'Doe',
      gender: Gender.Male,
    };
    employeeServiceSpy.getEmployeeByRegistrationNumber$.and.returnValue(
      of(mockEmployee)
    );

    paramMap$.next(convertToParamMap({ registrationNumber: '00000001' }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(
      employeeServiceSpy.getEmployeeByRegistrationNumber$
    ).toHaveBeenCalledOnceWith('00000001');
    const child = getEmployeeFormInstance(fixture);
    expect(child).toBeTruthy();
    expect(child!.employee).toEqual(mockEmployee);
  });
});
