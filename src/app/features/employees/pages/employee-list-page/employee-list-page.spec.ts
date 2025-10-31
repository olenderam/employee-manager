import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { RouterLink } from '@angular/router';

import { EmployeeListPage } from './employee-list-page';
import { EmployeeList } from '../../components/employee-list/employee-list';
import {
  EmployeeFilters,
  EmployeeFiltersModel,
} from '../../components/employee-filters/employee-filters';
import { EmployeeFormPage } from '../employee-form-page/employee-form-page';

describe('EmployeeListPage', () => {
  let fixture: ComponentFixture<EmployeeListPage>;
  let component: EmployeeListPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeListPage, EmployeeList, EmployeeFilters, RouterLink],
      providers: [
        provideRouter(
          [
            {
              path: 'employees/new',
              component: EmployeeFormPage,
              data: { mode: 'create' },
            },
            {
              path: 'employees/:id',
              component: EmployeeFormPage,
              data: { mode: 'edit' },
            },
          ],
          withEnabledBlockingInitialNavigation()
        ),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the page', () => {
    expect(component).toBeTruthy();
  });

  it('should render header', () => {
    const header = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(header.textContent.trim()).toBe('Lista Pracowników');
  });

  it('should initialize filters$ with empty fields', (done) => {
    component.filters$.subscribe((value) => {
      expect(value).toEqual({ firstName: '', lastName: '' });
      done();
    });
  });

  it('should update filters$ when filtersChange', () => {
    const filtersComponent = fixture.debugElement.query(
      By.directive(EmployeeFilters)
    ).componentInstance as EmployeeFilters;

    const newFilters: EmployeeFiltersModel = {
      firstName: 'John',
      lastName: 'Doe',
    };
    filtersComponent.filtersChange.emit(newFilters);

    let latest!: EmployeeFiltersModel;
    component.filters$.subscribe((v) => (latest = v)).unsubscribe();
    expect(latest).toEqual(newFilters);
  });

  it('should pass filters$ to employee list', () => {
    const listComponent = fixture.debugElement.query(By.directive(EmployeeList))
      .componentInstance as EmployeeList;

    expect(listComponent.filters$).toBe(component.filters$);
  });
});
