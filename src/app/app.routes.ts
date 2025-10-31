import { Routes } from '@angular/router';
import { EMPLOYEES_ROUTES } from './features/employees/employees.routes';

export const routes: Routes = [
  ...EMPLOYEES_ROUTES,
  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'employees',
  },
];
