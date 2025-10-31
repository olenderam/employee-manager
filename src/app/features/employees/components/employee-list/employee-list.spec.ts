import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EmployeeList } from './employee-list';
import { EmployeeService } from '../../services/employee.service';
import { Employee, Gender } from '../../models/employee.model';
import { EmployeeFiltersModel } from '../employee-filters/employee-filters';

describe('EmployeeList', () => {
  const EMPLOYEES: Employee[] = [
    {
      id: 'uuid-1',
      registrationNumber: '00000001',
      firstName: 'John',
      lastName: 'Doe',
      gender: Gender.Male,
    },
    {
      id: 'uuid-2',
      registrationNumber: '00000002',
      firstName: 'Jane',
      lastName: 'Smith',
      gender: Gender.Female,
    },
    {
      id: 'uuid-3',
      registrationNumber: '00000003',
      firstName: 'Alice',
      lastName: 'Brown',
      gender: Gender.Female,
    },
    {
      id: 'uuid-4',
      registrationNumber: '00000004',
      firstName: 'Bob',
      lastName: 'Johnson',
      gender: Gender.Male,
    },
  ];

  let employeeServiceSpy: jasmine.SpyObj<EmployeeService>;
  let filters$: BehaviorSubject<EmployeeFiltersModel>;

  function rowTds(fixture: any): string[][] {
    const rows = Array.from<HTMLTableRowElement>(
      fixture.nativeElement.querySelectorAll('tbody tr')
    );
    return rows.map((r) =>
      Array.from(r.querySelectorAll('td')).map((td) =>
        (td.textContent ?? '').trim()
      )
    );
  }

  beforeEach(async () => {
    employeeServiceSpy = jasmine.createSpyObj('EmployeeService', [
      'getEmployees$',
    ]);
    employeeServiceSpy.getEmployees$.and.returnValue(of(EMPLOYEES));

    filters$ = new BehaviorSubject<EmployeeFiltersModel>({
      firstName: '',
      lastName: '',
    });

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, EmployeeList],
      providers: [{ provide: EmployeeService, useValue: employeeServiceSpy }],
    }).compileComponents();

    spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EmployeeList);
    fixture.componentInstance.filters$ = filters$;
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render employees sorted by registrationNumber ascending', async () => {
    const fixture = TestBed.createComponent(EmployeeList);
    fixture.componentInstance.filters$ = filters$;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const tds = rowTds(fixture);
    const regNumbers = tds.map((cells) => cells[0]);
    expect(regNumbers).toEqual([
      '00000001',
      '00000002',
      '00000003',
      '00000004',
    ]);
  });

  it('should filter by firstName and lastName', async () => {
    const fixture = TestBed.createComponent(EmployeeList);
    fixture.componentInstance.filters$ = filters$;
    fixture.detectChanges();

    filters$.next({ firstName: 'jo', lastName: '' });
    await fixture.whenStable();
    fixture.detectChanges();

    let tds = rowTds(fixture);
    expect(tds.map((c) => c[2])).toEqual(['John']);

    filters$.next({ firstName: 'jo', lastName: 'do' });
    await fixture.whenStable();
    fixture.detectChanges();

    tds = rowTds(fixture);
    const fullNames = tds.map((c) => `${c[2]} ${c[1]}`);
    expect(fullNames).toEqual(['John Doe']);
  });

  it('should sort by lastName ascending and descending', async () => {
    const fixture = TestBed.createComponent(EmployeeList);
    const component = fixture.componentInstance;
    component.filters$ = filters$;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    component.onSort('lastName');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    let tds = rowTds(fixture);
    expect(tds.map((c) => c[1])).toEqual(['Brown', 'Doe', 'Johnson', 'Smith']);

    component.onSort('lastName');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    tds = rowTds(fixture);
    expect(tds.map((c) => c[1])).toEqual(['Smith', 'Johnson', 'Doe', 'Brown']);
  });

  it('should sort by firstName ascending', async () => {
    const fixture = TestBed.createComponent(EmployeeList);
    const component = fixture.componentInstance;
    component.filters$ = filters$;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    component.onSort('firstName');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const tds = rowTds(fixture);
    expect(tds.map((c) => c[2])).toEqual(['Alice', 'Bob', 'Jane', 'John']);
  });

  it('should navigate to edit page on edit button click', async () => {
    const fixture = TestBed.createComponent(EmployeeList);
    const component = fixture.componentInstance;
    component.filters$ = filters$;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const firstButton: HTMLButtonElement | null =
      fixture.nativeElement.querySelector('tbody tr:first-child button');
    firstButton!.click();

    expect(TestBed.inject(Router).navigate).toHaveBeenCalledOnceWith([
      '/employees',
      '00000001',
      'edit',
    ]);
  });
});
