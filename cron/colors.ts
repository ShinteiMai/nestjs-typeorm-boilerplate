import axios from 'axios';
import { getDomain } from '.';
import { colors } from '../data/colors.json';
import authenticate from './authenticate';

const initializeColors = async () => {
  const domain = getDomain();
  const url = `${domain}/colors`;
  const jwt = await authenticate();
  for await (const color of colors) {
    const { data } = await axios.post(
      url,
      {
        name: color.name,
        hex: color.hex,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    console.log(data);
  }
};

initializeColors();
