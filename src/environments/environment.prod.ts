export const environment = {
  production: true,
  adtenantid: (window as any)?.envConfig?.adtenantid,
  adclientid: (window as any)?.envConfig?.adclientid,
  languages: ['ro', 'en'],
  publicvapidkey: (window as any)?.envConfig?.publicvapidkey,
  notificationsElementsPerPage: 50,
  toastDuration: 5000,
};
