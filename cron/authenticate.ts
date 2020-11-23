import axios from 'axios';
import { authenticationData, getDomain } from './index';

const authenticate = async () => {
  const domain = getDomain();
  const url = `${domain}/auth/login`;
  const { data } = await axios.post(url, authenticationData);
  return data.token;
};

export default authenticate;
