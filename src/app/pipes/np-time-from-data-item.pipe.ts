import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
import { IDataItem } from '../@types/types';

@Pipe({
  name: 'npTimeFromDataItem',
  standalone: true,
})
export class NpTimeFromDataItemPipe implements PipeTransform {
  transform(item?: IDataItem, viewId?: string): string {
    viewId = viewId || '';
    const time = dayjs(item?.startTime);
    let format = 'DD.MM.YYYY HH:mm';
    switch (viewId) {
      case '_daily':
      case '_today':
        format = 'DD.MM.YYYY';
        break;
      case '_monthly':
        format = 'MM.YYYY';
        break;
      case '_all':
        return '';
    }
    return time.format(format);
  }
}
