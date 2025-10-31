import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-control-errors',
  imports: [],
  templateUrl: './control-errors.html',
  styleUrl: './control-errors.scss',
})
export class ControlErrors {
  @Input({ required: true }) control!: AbstractControl | null;
}
