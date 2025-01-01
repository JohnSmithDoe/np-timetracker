import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';
import { TColor } from '../../../@types/types';

@Component({
  selector: 'app-text-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './text-item.component.html',
  styleUrls: ['./text-item.component.scss'],
  imports: [IonItem, IonLabel, IonNote],
})
export class TextItemComponent {
  @Input() label?: string | null;
  @Input() color?: TColor;
  @Input() helper?: string;
  @Input() time?: string;
  @Input() note?: string | null;

  @Output() selectItem = new EventEmitter<void>();

  constructor() {}

  selectCurrent() {
    this.selectItem.emit();
  }
}
