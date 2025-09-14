import { Component, input } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonList } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Dayjs } from 'dayjs';

@Component({
  selector: 'app-dash-holidays',
  templateUrl: './dash-holidays.component.html',
  styleUrls: ['./dash-holidays.component.scss'],
  imports: [IonCard, IonCardContent, IonCardHeader, IonCardTitle, TranslateModule, IonList, IonItem],
})
export class DashHolidaysComponent {
  readonly title = input<string | undefined>();
  readonly holidays = input<{name:string, date:Dayjs}[] | undefined | null>();
}
