import { Routes } from '@angular/router';
import { EmployeeFormPage } from './pages/employee-form-page/employee-form-page';
import { EmployeeListPage } from './pages/employee-list-page/employee-list-page';

export const EMPLOYEES_ROUTES: Routes = [
  {
    path: 'employees',
    children: [
      {
        path: '',
        component: EmployeeListPage,
      },
      {
        path: 'new',
        component: EmployeeFormPage,
        data: { mode: 'create' },
      },
      {
        path: ':registrationNumber/edit',
        component: EmployeeFormPage,
        data: { mode: 'edit' },
      },
    ],
  },
];
