import {
  ChangeDetectionStrategy,
  Component,
  Input,
  output,
  input
} from '@angular/core';
import { IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';
import { TColor } from '../../../@types/types';

@Component({
    selector: 'app-text-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './text-item.component.html',
    styleUrls: ['./text-item.component.scss'],
    imports: [IonItem, IonLabel, IonNote]
})
export class TextItemComponent {
  readonly label = input<string | null>();
  readonly color = input<TColor>();
  @Input() helper?: string;
  @Input() time?: string;
  @Input() note?: string | null;

  readonly selectItem = output<void>();

  constructor() {}

  selectCurrent() {
    this.selectItem.emit();
  }
}
