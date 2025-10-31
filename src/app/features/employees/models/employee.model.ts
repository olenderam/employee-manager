export enum Gender {
  Male = 'Mężczyzna',
  Female = 'Kobieta',
  Other = 'Inne',
}

export interface Employee {
  id: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  gender: Gender;
}
