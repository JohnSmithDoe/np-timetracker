import { createActionGroup, emptyProps } from '@ngrx/store';
import { Dayjs } from 'dayjs';

export const officeTimeActions = createActionGroup({
  source: 'Office Time',
  events: {
    'Load Holidays': emptyProps(),
    'Load Holidays Failure': emptyProps(),
    'Load Holidays Success': (holidays: Record<string, Dayjs>) => ({
      holidays,
    }),
    'Save Office Time': emptyProps(),
  },
});
