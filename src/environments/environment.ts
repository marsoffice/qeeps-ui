import { localenv } from 'localenv';
export const environment = {
  production: false,
  adtenantid: localenv.adtenantid,
  adclientid: localenv.adclientid,
  usefunctionproxy: 'false',
  languages: ['ro', 'en'],
  publicvapidkey: localenv.publicvapidkey,
  notificationsElementsPerPage: 50,
  toastDuration: 5000,
};

import 'zone.js/plugins/zone-error';
