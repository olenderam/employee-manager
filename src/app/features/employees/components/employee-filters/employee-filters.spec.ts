import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { EmployeeFilters } from './employee-filters';

describe('EmployeeFilters', () => {
  function setInputValue(input: HTMLInputElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  function getElements(fixture: any) {
    const el: HTMLElement = fixture.nativeElement;
    const lastName = el.querySelector(
      'input[formControlName="lastName"]'
    ) as HTMLInputElement;
    const firstName = el.querySelector(
      'input[formControlName="firstName"]'
    ) as HTMLInputElement;
    const clearBtn = el.querySelector('button') as HTMLButtonElement;
    return { firstName, lastName, clearBtn };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, EmployeeFilters],
    }).compileComponents();
  });

  it('should create and initialize form with filters', () => {
    const fixture = TestBed.createComponent(EmployeeFilters);
    fixture.componentRef.setInput('filters', {
      firstName: 'Jane',
      lastName: 'Smith',
    });
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
    expect(component.form.getRawValue()).toEqual({
      firstName: 'Jane',
      lastName: 'Smith',
    });

    const { firstName, lastName } = getElements(fixture);
    expect(firstName.value).toBe('Jane');
    expect(lastName.value).toBe('Smith');
  });

  it('should emit filtersChange', fakeAsync(() => {
    const fixture = TestBed.createComponent(EmployeeFilters);
    fixture.componentRef.setInput('filters', { firstName: '', lastName: '' });
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const emitSpy = spyOn(component.filtersChange, 'emit');
    const { firstName, lastName } = getElements(fixture);

    setInputValue(firstName, 'Jo');
    setInputValue(lastName, 'Doe');
    tick(299);
    expect(emitSpy).not.toHaveBeenCalled();

    tick(1);
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith({
      firstName: 'Jo',
      lastName: 'Doe',
    });
  }));

  it('should not emit when values are unchanged', fakeAsync(() => {
    const fixture = TestBed.createComponent(EmployeeFilters);
    fixture.componentRef.setInput('filters', { firstName: '', lastName: '' });
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const emitSpy = spyOn(component.filtersChange, 'emit');
    const { firstName } = getElements(fixture);

    setInputValue(firstName, 'John');
    tick(300);
    expect(emitSpy).toHaveBeenCalledTimes(1);

    setInputValue(firstName, 'John');
    tick(300);
    expect(emitSpy).toHaveBeenCalledTimes(1);
  }));

  it('should patches the form on changes without emitting new value', fakeAsync(() => {
    const fixture = TestBed.createComponent(EmployeeFilters);
    fixture.componentRef.setInput('filters', { firstName: '', lastName: '' });
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const emitSpy = spyOn(component.filtersChange, 'emit');

    fixture.componentRef.setInput('filters', {
      firstName: 'Alice',
      lastName: 'Brown',
    });
    fixture.detectChanges();

    tick(500);
    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.form.getRawValue()).toEqual({
      firstName: 'Alice',
      lastName: 'Brown',
    });
  }));

  it('should reset the form and emits empty strings', fakeAsync(() => {
    const fixture = TestBed.createComponent(EmployeeFilters);
    fixture.componentRef.setInput('filters', {
      firstName: 'John',
      lastName: 'Doe',
    });
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const emitSpy = spyOn(component.filtersChange, 'emit');
    const { clearBtn, firstName, lastName } = getElements(fixture);
    expect(firstName.value).toBe('John');
    expect(lastName.value).toBe('Doe');

    clearBtn.click();
    tick(300);

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith({ firstName: '', lastName: '' });
    expect(firstName.value).toBe('');
    expect(lastName.value).toBe('');
  }));
});
