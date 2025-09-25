import {Component, computed, input} from '@angular/core';
import {IonCard, IonCardContent, IonCardHeader, IonCardTitle,} from '@ionic/angular/standalone';
import {DashboardStats} from "../../../@types/types";

@Component({
  selector: 'app-dash-percentage',
  templateUrl: './dash-percentage.component.html',
  styleUrls: ['./dash-percentage.component.scss'],
  imports: [IonCard, IonCardContent, IonCardHeader, IonCardTitle],
})
export class DashPercentageComponent {
  readonly title = input<string | undefined>();
  readonly stats = input<DashboardStats | null>();
  readonly percentage = computed(() => {
    return this.stats()?.fullTime?.percentage ?? 0;
  })
}
