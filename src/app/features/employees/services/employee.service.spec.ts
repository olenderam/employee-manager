import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EmployeeService } from './employee.service';
import { Employee } from '../models/employee.model';
import { INITIAL_EMPLOYEES } from '../data/employee.data';

const DELAY_TIME = 300;

describe('EmployeeService', () => {
  let service: EmployeeService;
  let randomUuidSpy: jasmine.Spy | undefined;

  function makeEmployee(
    partial: Partial<Employee> & { id?: string; registrationNumber?: string }
  ): Employee {
    return {
      id: partial.id ?? 'uuid-1',
      registrationNumber: partial.registrationNumber ?? '00000001',
      ...partial,
    } as Employee;
  }

  function setStoredData(data: Employee[] | null) {
    (localStorage.getItem as jasmine.Spy).and.returnValue(
      data ? JSON.stringify(data) : null
    );
  }

  function mockCryptoRandomUUID(returnValue = 'uuid-1') {
    if (window.crypto && 'randomUUID' in window.crypto) {
      randomUuidSpy = spyOn(window.crypto as any, 'randomUUID').and.returnValue(
        returnValue
      );
    } else {
      spyOnProperty(window as any, 'crypto', 'get').and.returnValue({
        randomUUID: jasmine.createSpy().and.returnValue(returnValue),
      } as any);
      randomUuidSpy = undefined;
    }
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeService],
    });

    mockCryptoRandomUUID('uuid-1');
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem').and.stub();
  });

  it('should initialize default value when storage is empty', (done) => {
    setStoredData(null);
    service = TestBed.inject(EmployeeService);

    service.getEmployees$().subscribe((employees) => {
      expect(employees).toEqual(INITIAL_EMPLOYEES);
      done();
    });
  });

  it('should initialize from localStorage when data exists', (done) => {
    const storedEmployees = [
      makeEmployee({ id: 'uuid-1', registrationNumber: '00000001' }),
    ];
    setStoredData(storedEmployees);
    service = TestBed.inject(EmployeeService);

    service.getEmployees$().subscribe((employees) => {
      expect(employees).toEqual(storedEmployees);
      done();
    });
  });

  it('should return the matching employee', fakeAsync(() => {
    setStoredData(null);
    service = TestBed.inject(EmployeeService);
    const target = INITIAL_EMPLOYEES[0];

    service
      .getEmployeeByRegistrationNumber$(target.registrationNumber)
      .subscribe((found) => {
        expect(found).toEqual(target);
      });

    tick(DELAY_TIME);

    service
      .getEmployeeByRegistrationNumber$('99999999')
      .subscribe((notFound) => {
        expect(notFound).toBeNull();
      });
  }));

  it('should append employee and save to local storage', fakeAsync(() => {
    const base = [
      makeEmployee({ id: 'uuid-1', registrationNumber: '00000001' }),
      makeEmployee({ id: 'uuid-10', registrationNumber: '00000010' }),
      makeEmployee({ id: 'uuid-2', registrationNumber: '00000002' }),
    ];
    setStoredData(base);
    service = TestBed.inject(EmployeeService);

    let createdEmployee: Employee;

    service
      .addEmployee({} as Omit<Employee, 'id' | 'registrationNumber'>)
      .subscribe((e) => {
        createdEmployee = e;
        expect(randomUuidSpy).toHaveBeenCalled();
        expect(createdEmployee.id).toBe('uuid-1');
        expect(createdEmployee.registrationNumber).toBe('00000011');
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'employees',
          jasmine.stringMatching(/"registrationNumber":"00000011"/)
        );
      });

    tick(DELAY_TIME);

    service.getEmployeeByRegistrationNumber$('00000011').subscribe((e) => {
      expect(e).toEqual(createdEmployee);
    });
  }));

  it('should replace value and update local storage on employee update', (done) => {
    const base = [
      makeEmployee({ id: 'uuid-1', registrationNumber: '00000001' }),
      makeEmployee({ id: 'uuid-2', registrationNumber: '00000002' }),
    ];
    setStoredData(base);
    service = TestBed.inject(EmployeeService);

    const update: Employee = { ...base[1], firstName: 'Updated Name' };

    service.updateEmployee(update).subscribe((returned) => {
      expect(returned).toEqual(jasmine.objectContaining({ id: 'uuid-2' }));
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'employees',
        jasmine.stringMatching(/Updated Name|00000002/)
      );
      done();
    });

    service
      .getEmployeeByRegistrationNumber$('00000002')
      .subscribe((employee) => {
        expect(employee?.firstName).toEqual('Updated Name');
        done();
      });
  });
});
