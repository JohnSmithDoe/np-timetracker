import { Component, input, output } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dash-button',
  templateUrl: './dash-button.component.html',
  styleUrls: ['./dash-button.component.scss'],
  imports: [IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, TranslateModule, IonButton],
})
export class DashButtonComponent {
  readonly title = input<string | undefined>();
  readonly workdays = input<number | undefined>();
  readonly officeDays = input<number | undefined>();
  readonly remaining = input<number | undefined>();
  readonly buttonClick= output<void>();
}
