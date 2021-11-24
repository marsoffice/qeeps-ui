import { localenv } from 'localenv';
export const environment = {
  production: false,
  adtenantid: localenv.adtenantid,
  adclientid: localenv.adclientid,
  languages: ['ro', 'en'],
  defaultLanguage: 'ro',
  publicvapidkey: localenv.publicvapidkey,
  notificationsElementsPerPage: 50,
  toastDuration: 5000,
  acceptedFileExtensions: [
    '.zip',
    '.rar',
    '.7z',
    '.cab',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.mp4',
    '.avi',
    '.mkv',
    '.mp3',
    '.wav',
    '.pdf',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.doc',
    '.docx',
    '.accdb',
    '.sql',
    '.rtf',
    '.txt',
    '.tar',
    '.gz',
    '.bz2'
  ]
};

import 'zone.js/plugins/zone-error';
