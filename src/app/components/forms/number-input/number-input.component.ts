import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { InputCustomEvent } from '@ionic/angular';
import { IonInput, IonItem } from '@ionic/angular/standalone';
import { parseNumberInput } from '../../../app.utils';

@Component({
  selector: 'app-number-input',
  standalone: true,
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  imports: [IonItem, IonInput],
})
export class NumberInputComponent {
  @Input() label?: string;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() value?: string | number | null;
  @Output() updateValue = new EventEmitter<number>();

  constructor() {}

  updateInputValue(ev: InputCustomEvent) {
    this.updateValue.emit(parseNumberInput(ev));
  }
}
