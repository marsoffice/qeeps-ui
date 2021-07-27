export const environment = {
  production: true,
  adTenantId: (window as any)?.envConfig?.adTenantId,
  adClientId: (window as any)?.envConfig?.adClientId
};
