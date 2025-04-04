import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonContent, IonList } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import { BooleanKeys, ISettings } from '../../@types/types';
import { PageHeaderComponent } from '../../components/pages/page-header/page-header.component';
import { SettingsActions } from '../../state/settings/settings.actions';
import { selectSettingsState } from '../../state/settings/settings.selector';

@Component({
    selector: 'app-page-settings',
    templateUrl: 'settings.page.html',
    styleUrls: ['settings.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PageHeaderComponent, IonContent, TranslateModule, IonList]
})
export class SettingsPage {
  readonly #store = inject(Store);
  readonly settings$ = this.#store.select(selectSettingsState);

  constructor() {
    addIcons({ add, remove });
  }

  toggleFlag(flag: BooleanKeys<ISettings>) {
    this.#store.dispatch(SettingsActions.toggleFlag(flag));
  }
}
