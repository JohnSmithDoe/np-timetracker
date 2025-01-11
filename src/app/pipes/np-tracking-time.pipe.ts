import { Pipe, PipeTransform } from '@angular/core';
import { IDataItem } from '../@types/types';
import * as dayjs from 'dayjs';

@Pipe({
  name: 'npTrackingTime',
  standalone: true,
})
export class NpTrackingTimePipe implements PipeTransform {
  transform(value: IDataItem): string {
    return dayjs(value.startTime)
      .startOf('date')
      .add(value ? value.trackedTimeInSeconds ?? 0 : 0, 'seconds')
      .format('HH:mm:ss');
  }
}
