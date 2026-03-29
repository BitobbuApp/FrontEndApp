import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bitobbu.app',
  appName: 'Bitobbu',
  webDir: 'dist',
  server: {
    cleartext: true,
    hostname: 'hub.bitobbu.app',
    androidScheme: 'https'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;