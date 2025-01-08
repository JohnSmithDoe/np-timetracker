import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';

@Pipe({
  name: 'npTimeFromSeconds',
  standalone: true,
})
export class NpTimeFromSecondsPipe implements PipeTransform {
  transform(value?: number): string {
    value = value || 0;
    const time = dayjs().startOf('date').add(value, 'seconds');
    return `${time.diff(dayjs().startOf('date'), 'minutes')}`;
  }
}
