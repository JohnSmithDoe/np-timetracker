import { Component, input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/angular/standalone';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { interval, map, startWith } from 'rxjs';

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
    TranslateModule,
    AsyncPipe,
  ],
})
export class DashDateComponent {
  readonly title = input<string | undefined>();

  readonly data = {
    date: dayjs().format('DD MMMM YYYY'),
    day: dayjs().format('dddd'),
    week: dayjs().week(),
    month: dayjs().format('MMMM'),
    year: dayjs().format('YYYY'),
    weekday: dayjs().format('dddd'),
  };
  time$ = interval(1000).pipe(
    startWith(0),
    map(() => dayjs().format('HH:mm:ss'))
  );
}
