import { localenv } from 'localenv';
export const environment = {
  production: false,
  adtenantid: localenv.adtenantid,
  adclientid: localenv.adclientid,
};

import 'zone.js/plugins/zone-error';
