import { localenv } from 'localenv';
export const environment = {
  production: false,
  adtenantid: localenv.adtenantid,
  adclientid: localenv.adclientid,
  languages: ['ro', 'en']
};

import 'zone.js/plugins/zone-error';
