import {Component, input} from '@angular/core';
import {DashboardStats} from '../../../@types/types';

@Component({
  selector: 'app-dash-percentage',
  templateUrl: './dash-percentage.component.html',
  styleUrls: ['./dash-percentage.component.scss'],
  imports: [],
})
export class DashPercentageComponent {
  readonly stats = input<DashboardStats | null>();
}
