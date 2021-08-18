import { localenv } from 'localenv';
export const environment = {
  production: false,
  adtenantid: localenv.adtenantid,
  adclientid: localenv.adclientid,
  languages: ['ro', 'en'],
  publicvapidkey: 'BJyVzZqrjdEBC6JhUbhslT3HTAP8oAe1TCj4Vt-xcuDA67GRYcvYFivzbpyes3DkD5X9itEjL-tZXGSWCg3X6DI',
  notificationsElementsPerPage: 50,
  toastDuration: 5000,
};

import 'zone.js/plugins/zone-error';
