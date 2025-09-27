import { Component, input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';
import { DashboardStats } from '../../../@types/types';
import { DashPercentageComponent } from '../dash-percentage/dash-percentage.component';
import { TranslateModule } from '@ngx-translate/core';

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
    DashPercentageComponent,
    TranslateModule,
  ],
})
export class DashStatsComponent {
  readonly title = input<string | undefined>();
  readonly data = input<DashboardStats | undefined | null>();
  readonly showPercentage = input<boolean | undefined>();
}
