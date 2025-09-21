import { Component, input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Dayjs } from 'dayjs';

@Component({
  selector: 'app-dash-office-days',
  templateUrl: './dash-office-days.component.html',
  styleUrls: ['./dash-office-days.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    TranslateModule,
    IonList,
    IonItem,
  ],
})
export class DashOfficeDaysComponent {
  readonly title = input<string | undefined>();
  readonly officeDays = input<Array<Dayjs> | undefined | null>();
}
