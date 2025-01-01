import { registerLocaleData } from '@angular/common';
import * as de from '@angular/common/locales/de';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  Platform,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    RouterLink,
    IonMenuToggle,
    TranslateModule,
  ],
})
export class AppComponent {
  private readonly platform = inject(Platform);

  constructor() {
    registerLocaleData(de.default);
  }

  shareShoppingList() {
    let csv = 'data';
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        // const fileTransfer: TransferObject = this.transfer.create();
        // var blob = new Blob([csv]);
        // const csvLocation = `${cordova.file.dataDirectory}${blob}`;
        // fileTransfer
        //   .download(csvLocation, this.storageDirectory + 'dallmannCSV')
        //   .then(
        //     (entry) => {},
        //     (error) => {}
        //   );
      } else {
        var blob = new Blob([csv]);
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = dayjs().format('LLL') + '.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  }
}
