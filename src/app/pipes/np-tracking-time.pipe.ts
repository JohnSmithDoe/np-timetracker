import { Pipe, PipeTransform } from '@angular/core';
import { IDataItem } from '../@types/types';
import dayjs from 'dayjs';

const pad = (value: number) => {
  if (value < 10) return `0${value}`;
  return value.toString();
};

@Pipe({
  name: 'npTrackingTime',
  standalone: true,
})
export class NpTrackingTimePipe implements PipeTransform {
  transform(value: IDataItem): string {
    const { hours, min, sec } = this.#getDuration(value);
    return `${pad(hours)}:${pad(min)}:${pad(sec)}`;
  }

  #getDuration = (value: IDataItem) => {
    const durationInSeconds = dayjs(value.startTime)
      .startOf('date')
      .add(value ? (value.trackedTimeInSeconds ?? 0) : 0, 'seconds');
    const startingPoint = dayjs().startOf('date');
    const hours = durationInSeconds.diff(startingPoint, 'hours');
    const min = durationInSeconds.diff(
      startingPoint.add(hours, 'hours'),
      'minutes'
    );
    const sec = durationInSeconds.diff(
      startingPoint.add(hours, 'hours').add(min, 'minutes'),
      'seconds'
    );
    return { hours, min, sec };
  };
}
