import { redirect } from 'react-router-dom';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { CONST_BACKEND_URL } from '@constant';

export async function action(props: { request: Request }) {
  const jwt = localStorage.getItem('jwt');
  const types = ['image/jpeg', 'image/png'];
  if (!jwt) redirect('/');

  let updateObject;
  const { request } = props;
  const CONST_ONEMB = 1000000;
  const imageForm = new FormData();
  const formData = await request.formData();
  const file: File = formData.get('pp') as File;
  const tmp = Object.fromEntries(formData);
  const username = tmp.username.toString();
  const password = tmp.password.toString();

  imageForm.append('image', file);
  const config: AxiosRequestConfig = {
    withCredentials: true,
    headers: { Authorization: `Bearer ${jwt!}` }
  };

  if (file && file.size !== 0) {
    if (!types.includes(file.type)) {
      throw new Error('Wrong file type should be png, jpeg, jpg.');
    }
    if (file.size > CONST_ONEMB) {
      throw new Error('File size should be under or equal to 1MB');
    }
    await axios.postForm(`${CONST_BACKEND_URL}/img/upload`, imageForm, config);
  }

  if (username.length !== 0) {
    if (!username.match(/^[a-z][^\W]{3,14}$/i)) {
      if (username.length > 15 || username.length < 4) {
        throw new Error('Username length must be 4-15 characters');
      }
      throw new Error(
        'Username start with [a-z], and contain only [a-zA-Z0-9]'
      );
    }
    const checkUsername = await axios
      .post(`${CONST_BACKEND_URL}/user/check`, { username }, config)
      .then((res: AxiosResponse) => res.data);

    if (!checkUsername) {
      throw new Error('Username already exist.');
    }

    updateObject = {
      username
    };
  }

  if (password.length !== 0) {
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
    if (password !== tmp.confirm.toString()) {
      throw new Error("Password doesn't match.");
    }
    updateObject = {
      ...updateObject,
      password
    };
  }

  if (updateObject) {
    try {
      await axios.put(
        `${CONST_BACKEND_URL}/user/update_profile`,
        updateObject,
        config
      );
    } catch (err: any) {
      if (err.response) {
        const errData = err.response.data as { message: string };
        throw new Error(errData.message);
      }
    }
  }
  if (password.length === 0 && username.length === 0) {
    return redirect('/profile');
  }
  return redirect('/');
}
