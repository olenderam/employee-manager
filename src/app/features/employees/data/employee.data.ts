import { Employee, Gender } from '../models/employee.model';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'uuid-1',
    registrationNumber: '00000001',
    firstName: 'Jan',
    lastName: 'Nowak',
    gender: Gender.Male,
  },
  {
    id: 'uuid-2',
    registrationNumber: '00000002',
    firstName: 'Anna',
    lastName: 'Kowalska',
    gender: Gender.Female,
  },
  {
    id: 'uuid-3',
    registrationNumber: '00000003',
    firstName: 'Andrzej',
    lastName: 'Janusz',
    gender: Gender.Other,
  },
];
