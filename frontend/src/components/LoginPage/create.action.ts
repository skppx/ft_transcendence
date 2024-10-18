import { redirect } from 'react-router-dom';
import axios, { isAxiosError } from 'axios';
import { CONST_BACKEND_URL } from '@constant';

type ErrorFormat = {
  message: string;
  path: string;
  statusCode: number;
  timestamp: string;
};

export async function action(props: { request: Request }) {
  const { request } = props;
  const formData = await request.formData();
  const user = Object.fromEntries(formData);
  const username = user.username.toString();
  const password = user.password.toString();
  const confirm = user.confirm.toString();
  const twoAuth = user.twofa === undefined ? 'off' : 'on';

  if (username === '' || password === '' || confirm === '') {
    throw new Error('No field should be empty');
  }

  // Regexp for check if username is valid
  if (!username.match(/^[a-z][^\W]{3,14}$/i)) {
    if (username.length > 15 || username.length < 4) {
      throw new Error('Username length must be 4-15 characters');
    }
    throw new Error('Username start with [a-z], and contain only [a-zA-Z0-9]');
  }

  // Regexp 1 min, 1 maj, 1 chiffre, 1 [!@#$%&], length >= 8
  if (
    !password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&])(?=.{8,})[\w\W\d]{8,}/i
    )
  ) {
    if (password.length < 8) {
      throw new Error('Password length must be 8 minimum');
    }
    throw new Error(
      'Password should contain 1 [A-Z], 1 [a-z], 1 [0-9], 1 [!@#$%&]'
    );
  }

  if (password !== confirm) {
    throw new Error("Password doesn't match");
  }

  // config axios so cookie are sent to server

  const config = {
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
  };
  const sendData = {
    username,
    password,
    twoAuth
  };

  try {
    const { data } = await axios.post(
      `${CONST_BACKEND_URL}/auth/create_profile`,
      sendData,
      config
    );

    localStorage.setItem('jwt', data.access_token);
    return twoAuth === 'on'
      ? redirect('/2fa-validation') // eslint-disable-line
      : redirect('/upload_img'); // eslint-disable-line
  } catch (err: any) {
    if (isAxiosError(err) && err.response) {
      const errType = err.response.data as ErrorFormat;
      throw new Error(errType.message);
    }
  }
}
