/* eslint operator-linebreak: 0 */

const CONST_URL = 'https://api.intra.42.fr/oauth/token';
const CONST_FRONTEND_URL = 'http://localhost:3000';
const CONST_INFO_URL = 'https://api.intra.42.fr/oauth/token/info';
const CONST_CALLBACK_URL =
  'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-596cda66f0747475f74108ccc47067de3786961428935f77fc53f37507af856b&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&response_type=code';
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
