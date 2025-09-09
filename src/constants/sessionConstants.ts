// NOTA: La función 'setSessionDate' no fue proporcionada.
// Se crea una función de ejemplo para que el código funcione.
const setSessionDate = (expirationInMinutes: number): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + expirationInMinutes);
  return date.toISOString();
};

const EXPIRATION_TIME = 30;

export const USER_DATA = {
  info: {
    userId: 67,
    userKey: '',
    email: '',
    userName: '',
    businessLine: {
      lobKey: '',
      lobDescription: '',
    },
    roles: [],
    permissions: [],
  },
  bearerToken: '',
};

export const REDIRECT = '/admin/init';

export const SESSION = {
  token: {
    accessToken: '',
    expires: '',
    tokenType: '',
  },
  url: '',
  expires: setSessionDate(EXPIRATION_TIME),
};

export const SESSION_TIMEOUT = 'session/timeout';
export const COOKIES_SMSESSION = 'SMSESSION';
export const SITEMINDER_SM_USER = 'SM_USER';
export const SITEMINDER_LOGOUT = '/public/logout';
