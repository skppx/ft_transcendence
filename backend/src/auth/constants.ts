/* eslint operator-linebreak: 0 */

const CONST_URL = 'https://api.intra.42.fr/oauth/token';
const CONST_FRONTEND_URL = 'http://localhost:3000';
const CONST_INFO_URL = 'https://api.intra.42.fr/oauth/token/info';
const CONST_CALLBACK_URL =
  'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-f52da636dd6edc444bb9854b664906654754e74cb7cc4fe1d448ee6930136d84&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&response_type=code';
const CONST_SALT = 10;
const CONST_LOCAL_LOGIN = 'http://localhost:3000/auth/login';

export {
  CONST_URL,
  CONST_FRONTEND_URL,
  CONST_INFO_URL,
  CONST_SALT,
  CONST_CALLBACK_URL,
  CONST_LOCAL_LOGIN
};
