import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'np.afterwork.timetracker',
  appName: 'time-tracker',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
};

export default config;
