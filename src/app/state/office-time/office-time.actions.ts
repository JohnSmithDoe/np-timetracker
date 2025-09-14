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
    'Add Office Time': emptyProps(),
    'Save Barcode': (base64Blob: string) => ({ base64Blob }),
    'Delete Barcode': emptyProps(),
    'Save Working Hours': (hours: number) => ({ hours }),
    'Save Working Hours Default': (hours: number) => ({ hours }),
  },
});
