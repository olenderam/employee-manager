import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';
import { ControlErrors } from './control-errors';

describe('ControlErrors', () => {
  let fixture: ComponentFixture<ControlErrors>;
  let component: ControlErrors;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlErrors],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlErrors);
    component = fixture.componentInstance;
  });

  function errorTexts(): string[] {
    return fixture.debugElement
      .queryAll(By.css('small.error'))
      .map((de) => (de.nativeElement as HTMLElement).textContent!.trim());
  }

  it('should create', () => {
    component.control = new FormControl('');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render nothing when control is null', () => {
    component.control = null;
    fixture.detectChanges();
    expect(errorTexts()).toEqual([]);
  });

  it('should render nothing when control is dirty but valid', () => {
    const ctrl = new FormControl('valid', Validators.required);
    ctrl.markAsDirty();
    component.control = ctrl;
    fixture.detectChanges();
    expect(errorTexts()).toEqual([]);
  });

  it('should show field required message', () => {
    const ctrl = new FormControl('');
    ctrl.addValidators(Validators.required);
    ctrl.updateValueAndValidity();
    ctrl.markAsDirty();

    component.control = ctrl;
    fixture.detectChanges();

    expect(errorTexts()).toContain('To pole jest wymagane.');
  });

  it('should show minLength message with requiredLength', () => {
    const ctrl = new FormControl('a', Validators.minLength(3));
    ctrl.markAsDirty();

    component.control = ctrl;
    fixture.detectChanges();

    expect(errorTexts()).toContain('Minimum 3 znaków');
  });

  it('should show maxlength message with requiredLength', () => {
    const ctrl = new FormControl('abcd', Validators.maxLength(3));
    ctrl.markAsDirty();

    component.control = ctrl;
    fixture.detectChanges();

    expect(errorTexts()).toContain('Maksimum 3 znaków');
  });

  it('should shows notBlank message', () => {
    const ctrl = new FormControl('   ');
    ctrl.setErrors({ notBlank: true });
    ctrl.markAsDirty();

    component.control = ctrl;
    fixture.detectChanges();

    expect(errorTexts()).toContain('Pole zawiera same spacje.');
  });

  it('should show multiple messages if multiple errors are present', () => {
    const ctrl = new FormControl('');
    ctrl.setErrors({
      required: true,
      minlength: { requiredLength: 5, actualLength: 0 },
    });
    ctrl.markAsDirty();

    component.control = ctrl;
    fixture.detectChanges();

    const texts = errorTexts();
    expect(texts).toContain('To pole jest wymagane.');
    expect(texts).toContain('Minimum 5 znaków');
  });
});
