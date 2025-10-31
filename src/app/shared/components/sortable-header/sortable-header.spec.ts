import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SortableHeader } from './sortable-header';

describe('SortableHeader', () => {
  let fixture: ComponentFixture<SortableHeader<string>>;
  let component: SortableHeader<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortableHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(SortableHeader<string>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render label text', () => {
    component.label = 'First Name';
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(label.textContent.trim()).toBe('First Name');
  });

  it('should emit sort event on click', () => {
    spyOn(component.sort, 'emit');
    component.column = 'firstName';
    fixture.detectChanges();

    const th = fixture.debugElement.query(By.css('th'));
    th.triggerEventHandler('click', null);

    expect(component.sort.emit).toHaveBeenCalledOnceWith('firstName');
  });

  it('should show ▲ when direction is asc', () => {
    component.label = 'First Name';
    component.column = 'firstName';
    component.active = 'firstName';
    component.direction = 'asc';
    fixture.detectChanges();

    const indicator = fixture.debugElement.query(
      By.css('.sort-indicator')
    ).nativeElement;
    expect(indicator.textContent.trim()).toBe('▲');
    expect(indicator.style.visibility).toBe('visible');
  });

  it('should show ▼ when direction is desc', () => {
    component.label = 'First Name';
    component.column = 'firstName';
    component.active = 'firstName';
    component.direction = 'desc';
    fixture.detectChanges();

    const indicator = fixture.debugElement.query(
      By.css('.sort-indicator')
    ).nativeElement;
    expect(indicator.textContent.trim()).toBe('▼');
    expect(indicator.style.visibility).toBe('visible');
  });

  it('should hide sort indicator when inactive', () => {
    component.label = 'First Name';
    component.column = 'firstName';
    component.active = 'lastName';
    fixture.detectChanges();

    const indicator = fixture.debugElement.query(
      By.css('.sort-indicator')
    ).nativeElement;
    expect(indicator.style.visibility).toBe('hidden');
  });
});
