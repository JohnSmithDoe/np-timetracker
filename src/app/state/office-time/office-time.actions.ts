import { createActionGroup, emptyProps } from '@ngrx/store';
import { Dayjs } from 'dayjs';
import { DashboardType } from '../../@types/types';

export const officeTimeActions = createActionGroup({
  source: 'Office Time',
  events: {
    'Init Office Time': emptyProps(),
    'Load Holidays': emptyProps(),
    'Load Holidays Failure': emptyProps(),
    'Load Holidays Success': (holidays: Record<string, Dayjs>) => ({
      holidays,
    }),
    'Save Office Time': emptyProps(),
    'Save Office Time Success': emptyProps(),
    'Add Office Time': emptyProps(),
    'Add Officeday': (officeday: Dayjs) => ({ officeday }),
    'Set Officedays': (officedays: Dayjs[]) => ({ officedays }),
    'Add Freeday': (freeday: Dayjs) => ({ freeday }),
    'Set Freedays': (freedays: (string | undefined | null)[]) => ({ freedays }),
    'Save Barcode': (base64Blob: string) => ({ base64Blob }),
    'Delete Barcode': emptyProps(),
    'Rotate Barcode': emptyProps(),
    'Rotate Barcode Success': (barcode: string) => ({
      barcode,
    }),
    'Save Working Hours': (hours: number) => ({ hours }),
    'Save Working Hours Default': (hours: number) => ({ hours }),
    'Save Dashboard Settings': (key: DashboardType, active: boolean) => ({
      key,
      active,
    }),
  },
});
