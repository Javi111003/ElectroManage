// export const API_URL =
// 'https://electromanage-bqfgehhedff7gnba.centralus-01.azurewebsites.net/';
export const API_URL = 'http://localhost:5173';
export const MAP_URL = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2';
export const LOCATION_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const MENU_OPTIONS_URL = 'assets/menu-options.json';
export const MSSG_ES_URL = 'assets/messages.es.json';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export const EXPORT_CENTER = '/v1/company/export/list';
export const EXPORT_AVG = '/v1/company/export/mean_cost';
export const EXPORT_EXCESS = '/v1/company/export/over_limit';
export const EXPORT_PREDICTION = '/v1/company/export/proyection';
export const EXPORT_EQUIPMENT = '/v1/equipment/export';
export const EXPORT_OFFICE = '/v1/office/export';
export const EXPORT_COMPARISON = '/v1/policy/export/comparison';
export const EXPORT_POLICY = '/v1/policy/export/list';
export const EXPORT_REGISTER = '/v1/register/export';
export const EXPORT_USER = '/v1/user/export';
export const EXPORT_ALERT = '/v1/warning/export';
