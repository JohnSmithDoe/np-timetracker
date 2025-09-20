import { Component, input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

@Component({
  selector: 'app-dash-date',
  templateUrl: './dash-date.component.html',
  styleUrls: ['./dash-date.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonItem,
  ],
})
export class DashDateComponent {
  readonly title = input<string | undefined>();

  readonly data = {
    date: dayjs().format('DD.MM.YYYY'),
    day: dayjs().format('dddd'),
    week: dayjs().week(),
    month: dayjs().format('MMMM'),
    year: dayjs().format('YYYY'),
    weekday: dayjs().format('dddd'),
  };
}
