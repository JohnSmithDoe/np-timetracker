import { Component, input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-dash-stats',
  templateUrl: './dash-stats.component.html',
  styleUrls: ['./dash-stats.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonItem,
  ],
})
export class DashStatsComponent {
  readonly title = input<string | undefined>();
  readonly workdays = input<number | undefined>();
  readonly officeDays = input<number | undefined>();
  readonly remaining = input<number | undefined>();
}
