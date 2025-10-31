import { FormControl } from '@angular/forms';
import { notBlankValidator } from './not-blank.validator';

describe('notBlankValidator', () => {
  const validator = notBlankValidator();

  it('should return null for null value', () => {
    const control = new FormControl(null);
    expect(validator(control)).toBeNull();
  });

  it('should return null for empty string', () => {
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });

  it('should return validation error for string with only spaces', () => {
    const control = new FormControl('   ');
    expect(validator(control)).toEqual({ notBlank: true });
  });

  it('should return null for non-empty trimmed string', () => {
    const control = new FormControl('John');
    expect(validator(control)).toBeNull();
  });

  it('should return null for string with leading/trailing spaces but valid text', () => {
    const control = new FormControl('  John  ');
    expect(validator(control)).toBeNull();
  });
});
