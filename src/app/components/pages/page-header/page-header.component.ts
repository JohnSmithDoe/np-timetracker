import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Input,
  output,
  input
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { TColor } from '../../../@types/types';

@Component({
    selector: 'app-page-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss'],
    imports: [
        IonToolbar,
        IonHeader,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonButton,
        IonIcon,
        TranslateModule,
    ]
})
export class PageHeaderComponent {
  @Input() label = '';
  readonly color = input<TColor>();
  readonly hideButtons = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly addItem = output<void>();

  constructor() {
    addIcons({ add });
  }
}
