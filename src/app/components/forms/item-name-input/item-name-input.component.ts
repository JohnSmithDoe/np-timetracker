import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  output,
  input
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { marker } from '@colsen1991/ngx-translate-extract-marker';
import { IonInput, IonItem } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { IBaseItem, TMarker } from '../../../@types/types';
import { matchesSearchExactly, validateNameInput } from '../../../app.utils';

@Component({
    selector: 'app-item-name-input',
    templateUrl: './item-name-input.component.html',
    styleUrls: ['./item-name-input.component.scss'],
    imports: [IonInput, IonItem, ReactiveFormsModule, TranslateModule]
})
export class ItemNameInputComponent implements OnInit, OnDestroy, OnChanges {
  readonly item = input<IBaseItem | null>();
  readonly listItems = input<IBaseItem[] | null>();
  readonly updateValue = output<string>();

  public invalid = false;
  public valid = true;

  readonly nameControl: FormControl = new FormControl('');
  readonly #subscription: Subscription[] = [];

  constructor() {}

  ngOnInit() {
    // Hmm this seems a bit much only to get validation on the input.... but still no other solution found till now
    this.#subscription.push(
      // subscribe to the input changes and update the state
      this.nameControl.valueChanges.subscribe(
        (value: string | null | undefined) => {
          this.updateValue.emit(value ?? '');
        }
      ),
      this.nameControl.statusChanges.subscribe((value) => {
        this.valid = value === 'VALID';
        this.invalid = !this.valid;
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const item = this.item();
    if (
      changes.hasOwnProperty('item') &&
      !!item &&
      !matchesSearchExactly(item, this.nameControl.value ?? '')
    ) {
      this.nameControl.setValue(item.name);
      this.nameControl.markAsTouched();
    }
    const listItems = this.listItems();
    if (changes.hasOwnProperty('listItems') && listItems) {
      // update the validator on the input field...
      this.nameControl.setValidators(
        validateNameInput(listItems, item)
      );
      this.nameControl.updateValueAndValidity();
    }
  }

  ngOnDestroy(): void {
    this.#subscription.forEach((sub) => sub.unsubscribe());
  }

  getErrorText(): TMarker {
    {
      return this.nameControl.hasError('duplicate')
        ? marker('edit.item.dialog.name.duplicate.error')
        : marker('edit.item.dialog.name.empty.error');
    }
  }
}
