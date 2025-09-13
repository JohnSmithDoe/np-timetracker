import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonContent, IonItem, IonList } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import { BooleanKeys, ISettings } from '../../@types/types';
import { PageHeaderComponent } from '../../components/pages/page-header/page-header.component';
import { settingsActions } from '../../state/settings/settingsActions';
import { OfficeTimeService } from '../../services/office-time.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-page-office-time',
  templateUrl: 'office-time-page.component.html',
  styleUrls: ['office-time-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    IonContent,
    TranslateModule,
    IonList,
    IonItem,
    AsyncPipe,
  ],
})
export class OfficeTimePage {
  readonly #store = inject(Store);
  readonly #officeTimeService = inject(OfficeTimeService);

  readonly workDays$ = this.#officeTimeService.getWorkDaysForYear();
  readonly workDaysForMonth$ = this.#officeTimeService.getWorkDaysForMonth();

  constructor() {
    addIcons({ add, remove });
  }

  toggleFlag(flag: BooleanKeys<ISettings>) {
    this.#store.dispatch(settingsActions.toggleFlag(flag));
  }
}
