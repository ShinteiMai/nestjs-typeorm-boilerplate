import axios from 'axios';
import { getDomain, registerData } from './index';

const register = async () => {
  const domain = getDomain();
  const url = `${domain}/auth/signup`;
  await axios.post(url, registerData);
};

register();
